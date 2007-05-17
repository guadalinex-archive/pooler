#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Author: Junta de Andalucía <devmaster@guadalinex.org>
#  
# Code: Antonio González Romero <antonio.gonzalez.romero.ext@juntadeandalucia.es>

import package
import os
import optparse
import string
import shutil
import bz2
import packagesList
import ConfigParser
import sys
import gzip
import time

from re import findall


class   option_parser:
    
    def __init__(self):
    
        self.parser = optparse.OptionParser("addpkg  -p <debian package> -r <repository path> -d <distribution> ")
        
                                  
        self.parser.add_option("-p", "--package",
                          dest="deb", default=None,
                          type="string", help="Especify the path to de package you want to be added")
        self.parser.add_option("-r","--repo",
                          dest="repo", default=None,
                          type="string", help="Especify the root of the repository")
        self.parser.add_option("-d", "--dist", 
                          dest="dist", default=None,
                          type="string", help="Name under /dists")
        self.parser.add_option("-c", "--config",
                          dest="conf", default="/home/agonzalez/workspace/pooler/conf/repo.conf",
                          type="string", help="Especify the repo.conf file location")
        self.parser.add_option("-a", "--arch",
                          dest="arch", default="i386",
                          type="string", help="Architecture (i386,ppc...)")
	self.parser.add_option("-C", "--component",
			  dest="comp", default=None,
		 	  type="string", help="Component(main, restricted...)"	)
    
    def parse_args(self):
        return self.parser.parse_args()
        
class   adder:
    def __init__(self, repo, dist, deb, pool, apt_conf, comp, gid):

        #root directory (containning pool and dists)
        self.repo = repo
        self.dist = dist
        self.deb = deb
        self.pool = pool
        self.apt_conf = apt_conf
        self.section = comp
        self.apt_file = self.apt_conf + 'apt_%s.conf'%self.dist
        self.gid = gid
        
        
        #Printting params
        print 'apt config file\t\t%s'%self.apt_file
        print "raiz del repositorio\t%s"%self.repo
        print "pool\t\t\t%s"%self.pool
        print "section\t\t\t%s"%self.section
        print "deb\t\t\t%s"%self.deb
	print "Component\t\t%s"%comp
        
    def add_package(self):
        
	#Creating package instance
        current = package.package()      
        file_name = self.deb.split(os.sep)[-1]
        #Source files support
        if file_name.endswith('.dsc'):
            current.setBinary(False)
        #TODO:filter wrong input
        if os.path.exists(self.deb):
            if current.importInfo(self.deb):
                sys.exit(2)
        else:
            print "The file %s doesn't exists"%self.deb
            sys.exit(2)
        
        if not os.path.exists(self.apt_file):
            print "No se encuentra el fichero de configuraci�n apt_codename.conf"
            sys.exit(9)

        current_section = current.get('Section')
        current_arch = current.get('Architecture').strip()
        #Get supported sections and architectures from apt config file
        (dist_sections, dist_architectures) = self.getAptInfo()
    
        #Check if both section and architectures exist in the repository
        current_section = current_section.split('/')
        if self.section:
	    pass
	elif not self.section and len(current_section) > 1 and current_section[0] in dist_sections:
            self.section = current_section[0].strip()
        #If no section is especified or it doesn't exists set main section as default.
        else:
            self.section = 'main'
        print "section\t\t\t%s"%self.section
        #Check if architecture exists
        #TODO: Add in all  architectures.
        dist_architectures.append('all')
        default = 'i386'
        print 'current_arch: %s'%current_arch
        if current.isBinary() and current_arch in dist_architectures:
            if current_arch == 'all':
                current_arch = default
            self.arch = 'binary-%s'%current_arch
        elif not current.isBinary() and current_arch in ['all','any']:
            self.arch = 'source'
        else:
            print '\nUnknown architecture: %s'%current_arch
            sys.exit(3)
        print 'Architecture: %s'%self.arch
        self.branch = os.path.join(os.sep,self.repo, 'dists', self.dist, self.section, self.arch)
        self.lockBranch()
        self.updateIndexFiles(current, file_name)
        self.updatePool(current)
        #self.gen_Release()
        self.unLockBranch()
        sys.exit(0)
    
    
    def lockBranch(self):
        lock = os.sep.join([self.branch, '.lock'])
        success = False
        print 'Waiting to lock.'
        for i in range(10):
            if not os.path.exists(lock):
                os.system('touch %s'%lock)
                print '\n-------------------------------------------------'
                print 'locking branch %s'%self.branch
                print '-------------------------------------------------\n'
                success = True
                break
            else:
                time.sleep(0.1)

        if not success:
            print '\nError: branch already locked: %s'%self.branch
            sys.exit(4)
            
    def unLockBranch(self):
        lock = os.sep.join([self.branch, '.lock'])
        if os.path.exists(lock):
            print '\n-----------------------------------------------'
            print 'unlocking branch %s'%self.branch
            os.system('rm %s'%lock)
            print '-------------------------------------------------\n'
            
    '''
    Update information in index files (Packages and Sources)
    '''    
    def updateIndexFiles(self, current, file):
        
        #Build index files path
        f_packages_path = os.path.join(os.sep,self.repo, 'dists', self.dist, self.section, self.arch)
        section_path = os.path.join(os.sep, self.repo, 'dists', self.dist, self.section)
        
        #create new branch if needed
        if not os.path.exists(f_packages_path):
            newdir = os.path.join(os.sep,self.repo, 'dists', self.dist, self.section, self.arch)
            try:
                os.makedirs(newdir)
            except:
                print "Error creando directorio: %"%newdir
                sys.exit(10)
            os.chown(newdir, os.getuid(), self.gid)
            print "Creada rama nueva: %s"%f_packages_path 
               
        #Explore both .gz & .bz2 files
        index_file = self.getContent(f_packages_path, current.isBinary())
        pkglist = packagesList.packagesList()
        pkglist.loadInfo(index_file)

        file_Source = current.get('Source')
        file_Package = current.get('Package')

        #The package isn't in the Packages file.
        if not pkglist.searchPackage(current):            
        
            #Making destination path
            name = file_Source
            if not name:
                name = file_Package
            name = name.strip()
            if name[0:3] == 'lib':
                dir = name[0:4]
            else:
                dir = name[0]
            #destination = os.path.join(os.sep,self.repo, self.pool, self.section, dir, name.strip()) 
            #set Filename field in debian control structure.
            if current.isBinary():
                deb_filename = os.path.join(os.sep, self.pool, self.section, dir, name.strip(), file)[1:]
                print "filename field at debian index file: %s"%deb_filename
                current.set('Filename', deb_filename)
            #Directory information of current source package (for Sources.gz)
            else:
                directory = os.path.join(os.sep, self.pool, self.section, dir, name.strip())[1:]
                print "Directory field: %s"%directory
                current.set('Directory', directory)
            
            print "Adding it to the Packages/Sources file....."
            pkglist.addPackage(current)
    	    print "archivo: %s"%f_packages_path
            pkglist.newFiles(f_packages_path, current.isBinary())
            dirs = os.walk(f_packages_path)	    
            dirs = dirs.next()[-1]
            for f in dirs:
                if not f.startswith('.'):
                    try:
                        os.chmod(f_packages_path + os.sep + f, 0664)
                       # print "cambiando grupo a %s"%(f_packages_path + os.sep + f)
                        os.chown(f_packages_path + os.sep + f, os.getuid(), self.gid)
                    except:
    	    	        print 'Error cambiando los permisos a %s'%(f_packages_path + os.sep + f)
     	                #sys.exit(12)
                else:
                   continue
            del dirs
            self.gen_Release()
        else:
            print "The package is in the current distribution"
            self.unLockBranch()
            sys.exit(1)
                
    '''Update the pool structure'''    
    def updatePool(self, current):
     #Making directory structure in the pool if needed
        file_name = self.deb.split(os.sep)[-1]
        print "File name: %s"%file_name
        if current.isBinary():
            dir = os.sep.join(current.get('Filename').split(os.sep)[:-1])
            print "Dir: %s"%dir
            print "Repo: %s"%self.repo
            destination = os.sep.join([self.repo[:-1], dir])
        else:
            destination = os.path.join(os.sep, self.repo, current.get('Directory'))
            
        try:
            print "Creando directorio destino: %s"%destination
            os.makedirs(destination, 0775)
            #os.chmod(destination, 0775)
            #os.chown(destination, -1, self.gid)
        except:
            print "Copiando a directorio existente: %s"%destination
            pass
        print "File_name: %s"%os.path.join(os.sep,destination,file_name)
        if os.path.exists(os.path.join(os.sep,destination,file_name)):
            print 'El fichero ya se encuentra en el pool'
        else:
            #Copying binary package into the pool 
            if current.isBinary():
                shutil.copy(self.deb, destination)
                try:
                    os.chown(destination + '/' + file_name, -1, self.gid)
                    os.chmod(destination + '/' + file_name, 0664)
                except:
                    print "---Couldn't set group to %d on %s"%(self.gid, file_name)
            #Copying all source files in the package
            else:
                for i in current.files:
                    file = i.split(' ')[-1]
                    path = self.deb.split(os.sep)[:-1].append(file)
                    path = os.sep.join(path)
                    print "Current file...........%s  [OK]"%(os.sep.join(path))
                    #Trying to put into the pool
                    try:
                        shutil.copy(path, destination)
                    except:
                        self.unLockBranch()
                        print 'No se encuentra el fichero %s'%os.sep.join(path)
                        sys.exit(6)
                    #Setting owner group to 'pooler'
                    try:
                        os.chown(destination + '/' + file, -1, self.gid)
                    except:
                        print "---Couldn't set group to %d on %s"%(self.gid, file)
                        pass
        return 0

    '''
    Retrieve supported architectures and sections in the dist
    '''
    def getAptInfo(self):
    	try:
	        apt_fd = open (self.apt_file,"r")
	except:
		sys.exit(9)
        content = apt_fd.read()
        apt_fd.close()
        sections = findall('Components ".+"\S',content)[0].split('\"')[1].split(' ')
        architectures = findall('Architectures ".+"\S',content)[0].split('\"')[1].split(' ')
        del content
        return (sections, architectures)
    
    '''
    Returns the content of index file or create one if it doesn't exists
    '''    
    def getContent(self, file_path, isBinary):
        fd = None
        content = None
        if isBinary:
            files = ['Packages','Packages.bz2', 'Packages.gz']
            default = 'Packages.gz'
        else:
            files = ['Sources.gz','Sources.bz2', 'Sources']
            default = 'Sources.gz'
        for i in files:
            if os.path.exists(file_path + os.sep + i):
                if i.endswith('gz'):
                    fd =  gzip.open(file_path + os.sep + i,'r')
		    print file_path + os.sep + i
                    content = fd.read()
                    fd.close()
                elif i.endswith('bz2'):
                    fd = bz2.BZ2File(file_path + os.sep + i,"r")
                    content = fd.read()
                    fd.close()
                else:
                    fd = open(file_path + os.sep + i,"r")
                    content = fd.read()
                    fd.close()
                break
        
        if not content:
           fd = gzip.open(file_path + os.sep + default, "wb")
           fd.close()
           content = ''            
        return content
                
    '''
    Generates release information of the branch
    '''
    def gen_Release(self):
        #apt config files should be named apt_'codename'.conf. The location can be changed in repo.conf
        conf = os.path.join(os.sep, self.apt_conf, 'apt_%s.conf'%self.dist)
        location = os.path.join(os.sep, self.repo, 'dists', self.dist)
        
        command = 'apt-ftparchive -c %s release %s > %s/Release'%(conf, location, location)
        os.system(command)
        print "Regenerando releases......"
'''
Main addpkg function...
'''
def main():
    
    parser = option_parser()
    (options, args) = parser.parse_args()
    del args
    
    #Searching for the config file
    try:
    	config = ConfigParser.ConfigParser()
        config.read(options.conf)
    except:
        print "\n\n\nError: no encuentro el fichero de configuración del resositorio repo.conf\n\n\n "
     	sys.exit(9)       
    try:
	gid = int(config.get('defaults', 'gid'))
    except:
    	gid = os.getgid()
    if not options.repo:
    	name = config.get('defaults', 'repositorio')
	repo = config.get('repositorios', name)
    else:
    	name = options.repo
        repo = config.get('repositorios',options.repo)
            
    if not options.dist:
        dist = config.get('defaults', 'dist')
    else:
        dist = options.dist
      
    if not options.deb:
        print "No ha introducido el nombre del paquete"
        sys.exit(20)
    else:
        deb = options.deb
        
    #arch = config.get('defaults', 'arch')
    pool = config.get('pools', name + '.' + dist)
    apt_conf = config.get('defaults', 'apt_conf')
    component = options.comp

    addr = adder(repo, dist, deb, pool, apt_conf, component, gid)
    addr.add_package()
    #Package successfully added 



if __name__=='__main__':
    main()

