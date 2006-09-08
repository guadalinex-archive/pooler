#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Author: Antonio González Romero <antonio.gonzalez.romero.ext@juntadeandalucia.es>

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
                          type="string", help="Especify the distribution name")
        self.parser.add_option("-c", "--config",
                          dest="conf", default="/etc/poolmanager/repo.conf",
                          type="string", help="Especify the repo.conf file location")
      
    
    def parse_args(self):
        return self.parser.parse_args()
        
class   adder:
    def __init__(self, repo, dist, deb, pool, apt_conf):

        #root directory (containning pool and dists)
        self.repo = repo
        self.dist = dist
        self.deb = deb
        self.pool = pool
        self.apt_conf = apt_conf
        self.section = None
        self.apt_file = self.apt_conf + 'apt_%s.conf'%self.dist
        
        
        #Printting params
        print 'apt config file\t\t%s'%self.apt_file
        print "raiz del repositorio\t%s"%self.repo
        print "pool\t\t\t%s"%self.pool
        print "section\t\t\t%s"%self.section
        print "deb\t\t\t%s"%self.deb
        
    def add_package(self):
        
        #Creating package instance
        current = package.package()      
        file_name = self.deb.split(os.sep)[-1]
        #Source files support
        if file_name.endswith('.dsc'):
            current.setBinary(False)
        #TODO:filter wrong input
        if os.path.exists(self.deb):
            current.importInfo(self.deb)
        else:
            print "The file %s doesn't exists"%self.deb
            sys.exit(2)
        
        current_section = current.get('Section')
        current_arch = current.get('Architecture')
        #Get supported sections and architectures from apt config file
        (dist_sections, dist_architectures) = self.getAptInfo()
    
        #Check if both section and architectures exist in the repository
        current_section = current_section.split('/')
        if len(current_section) > 1 and current_section[0] in dist_sections:
            self.section = current_section.split('/')[0].strip()
        #If no section is especified or it doesn't exists set main section as default.
        else:
            self.section = 'main'
        print "section\t\t\t%s"%self.section
        #Check if architecture exists
        if current.isBinary() and current_arch in dist_architectures:
            self.arch = 'binary-%s'%current_arch
        elif not current.isBinary() and current_arch == 'any':
                self.arch = 'source'
        else:
            print '\nUnknown architecture: %s'%current_arch
            sys.exit(3)
        
        self.updateIndexFiles(current, file_name)
        self.updatePool(current)
        
        
           
        return done
    
    '''Update information in index files (Packages and Sources)'''
    def updateIndexFiles(self, current, file):
        
        #Build index files path
        f_packages_path = os.path.join(os.sep,self.repo, 'dists', self.dist, self.section, self.arch)
        section_path = os.path.join(os.sep, self.repo, 'dists', self.dist, self.section)
        
        #create new branch if needed
        if not os.path.exists(f_packages_path):
            os.makedirs(os.path.join(os.sep,self.repo, 'dists', self.dist, self.section, self.arch))
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
            pkglist.newFiles(f_packages_path, current.isBinary())
            self.gen_Release()
            
        else:
            print "The package is in the current distribution"
            sys.exit(1)
                
    '''Update the pool structure'''    
    def updatePool(self, current):
     #Making directory structure in the pool if needed
        file_name = self.deb.split(os.sep)[-1]
        print "File name: %s"%file_name
        if current.isBinary():
            dir = os.sep.join(current.get('Filename').split(os.sep)[:-1])
            print "Dir: %s"%dir
            destination = os.sep.join([self.repo[:-1], dir])
        else:
            destination = os.path.join(os.sep, self.repo, current.get('Directory'))
        print "Destination: %s"%destination
        
        if not os.path.exists(destination):
            os.makedirs(destination) 
        #The file exists in the pool         
            if os.path.exists(os.path.join(os.sep,destination,file_name)):
                print "The package  %s already exists in the pool"%file_name
                sys.exit(1)
            else:
                if current.isBinary():
                    shutil.copy(self.deb, destination)
                else:
                    for i in current.files:
                        path = self.deb.split(os.sep)[:-1]
                        path.append(i.split(' ')[-1])
                        print "files.........%s"%(os.sep.join(path))
                        shutil.copy(os.sep.join(path),destination)
        else:                        
            print "\n*******************\nThe package you choose is already in the repository\n*******************"
            print "Package.......................%s"%self.deb
            print "Location......................%s"%os.path.join(os.sep, self.repo, 'dists', self.dist, self.section, self.arch)
            sys.exit(1)
    
    '''Retrieve supported architectures and sections in the dist'''
    def getAptInfo(self):
        apt_fd = open (self.apt_file,"r")
        content = apt_fd.read()
        apt_fd.close()
        sections = findall('Components ".+"\S',content)[0].split('\"')[1].split(' ')
        architectures = findall('Architectures ".+"\S',content)[0].split('\"')[1].split(' ')
        #architectures.append('all')
        del content
        return (sections, architectures)
    
    '''Returns the content of index file or create one if it doesn't exists'''    
    def getContent(self, file_path, isBinary):
        fd = None
        content = None
        if isBinary:
            files = ['Packages','Packages.bz2', 'Packages.gz']
            default = 'Packages'
        else:
            files = ['Sources.gz','Sources.bz2', 'Sources']
            default = 'Sources'
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
           fd = open(file_path + os.sep + default, "wb")
           fd.close()
           content = ''            
        return content
                
    '''Generates release information of the branch'''
    def gen_Release(self):
        #apt config files should be named apt_'codename'.conf. The location can be changed in repo.conf
        conf = os.path.join(os.sep, self.apt_conf, 'apt_%s.conf'%self.dist)
        location = os.path.join(os.sep, self.repo, 'dists', self.dist)
        
        command = 'apt-ftparchive -c %s release %s > %s/Release'%(conf, location, location)
        os.system(command)
        print "Regenerando releases......"
        
def main():
    
    parser = option_parser()
    (options, args) = parser.parse_args()
    del args
    
    #Searching for the config file
    if os.path.exists(options.conf):
        config = ConfigParser.ConfigParser()
        config.read(options.conf)
    else:
        print "\n\n\nError: no encuentro el fichero de configuración del resositorio repo.conf\n\n\n "
            
    if not options.repo:
        repo = config.get('defaults', 'repositorio')
    else:
        repo = config.get('repositorios',options.repo)
            
    if not options.dist:
        dist = config.get('defaults', 'dist')
    else:
        dist = options.dist
      
    if not options.deb:
        print "No ha introducido el nombre del paquete"
        sys.exit(5)
    else:
        deb = options.deb
        
    #arch = config.get('defaults', 'arch')
    pool = config.get('pools', dist)
    apt_conf = config.get('defaults', 'apt_conf')
    
    addr = adder(repo, dist, deb, pool, apt_conf)
    #Package successfully added 
    if addr.add_package():
        addr.gen_Release()
    
    
        
if __name__=='__main__':
    main()

