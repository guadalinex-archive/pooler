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
        print 'apt config file\t\t\t%s'%self.apt_file
        print "raiz del repositorio\t\t\t%s"%self.repo
        print "pool\t\t\t%s"%self.pool
        print "dist\t\t\t%s"%self.dist
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
        
        file_Section = current.get('Section')
        
        #Get supported sections and architectures from apt config file
        apt_fd = open (self.apt_file,"r")
        content = apt_fd.read()
        apt_fd.close()
        sections = findall('Components ".+"\S',content)[0].split('\"')[1].split(' ')
        architectures = findall('Architectures ".+"\S',content)[0].split('\"')[1].split(' ')
        architectures.append('all')
        del content

        #Check if especified section exists in the repository
        current_section = file_Section.split('/')
        if len(current_section) > 1 and current_section[0] in sections:
            self.section = file_Section.split('/')[0].strip()
        #If no section is especified or it doesn't exists set main section as default.
        else:
            self.section = 'main'
        
        print "section\t\t\t%s"%self.section
        
        #Check if architecture exists
        section_Path = os.path.join(os.sep, self.repo, 'dists', self.dist, self.section)
        current_arch = current.get('Architecture')
        if current.isBinary() and current_arch in architectures:
            self.arch = 'binary-%s'%current_arch
        elif not current.isBinary() and current_arch == 'any':
                self.arch = 'source'
        else:
            print '\nUnknown architecture: %s'%current_arch
            sys.exit(3)
              
        f_packages_path = os.path.join(os.sep,self.repo, 'dists', self.dist, self.section, self.arch)
        print "Packages file path:\t\t\t%s"%f_packages_path
                        
        
        
        #create new branch if needed in dists/
        if not os.path.exists(f_packages_path):
            os.makedirs(os.path.join(os.sep,self.repo, 'dists', self.dist, self.section, self.arch))
            print "Creada rama nueva: %s"%f_packages_path 
           
        
        #Explore both .gz & .bz2 files
        index_file = self.getContent(f_packages_path, current.isBinary())
        pkglist = packagesList.packagesList()
        #retrieve information about packages from index file.
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
               
            destination = os.path.join(os.sep,self.repo, self.pool, self.section, dir, name.strip()) 
            #TODO: Check compatibility with source packages
            print "Name\t\t\t%s"%name
            print "Destination\t\t\t%s"%destination
            
            
            if current.isBinary():
                full_path = os.path.join(os.sep,destination,file_name)
                deb_filename = full_path.split(self.repo)[1]
                print "filename field at debian Packages file\t\t\t%s"%deb_filename
                #Puts filename field into debian control section.
                if deb_filename.startswith(os.sep):
                    current.set('Filename', deb_filename[1:])
                else:
                    current.set('Filename', deb_filename)
            #Directory information of current source package (for Sources.gz)
            else:
                directory = destination.split(self.repo)[1]
                print "Directory field at sources.gz:\t\t\t%s"%directory
                current.set('Directory', directory)
                #files_list = current.getFiles()
                #files_list.insert(0,)

            #Making directory structure in the pool if needed
            if not os.path.exists(destination):
                os.makedirs(destination)
                
            #The file exists in the pool         
            if os.path.exists(os.path.join(os.sep,destination,file_name)):
                print "The file  %s already exists in the pool"%file_name
            else:
                if current.isBinary():
                    shutil.copy(self.deb, destination)
                else:
                    for i in current.files:
                        path = self.deb.split(os.sep)[:-1]
                        path.append(i.split(' ')[-1])
                        print "files.........%s"%(os.sep.join(path))
                        shutil.copy(os.sep.join(path),destination)
                            
            print "Adding it to the Packages/Sources file....."
            pkglist.addPackage(current)
            pkglist.newFiles(f_packages_path, current.isBinary())
            done = True
        else:
            print "\n*******************\nThe package you choose is already in the repository\n*******************"
            print "Package.......................%s"%self.deb
            print "Location......................%s"%os.path.join(os.sep, self.repo, 'dists', self.dist, self.section, self.arch)
            done = False
            sys.exit(1)
        return done
        
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

