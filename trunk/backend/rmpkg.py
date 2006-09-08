#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Author: Antonio González Romero <antonio.gonzalez.romero.ext@juntadeandalucia.es>

import os
import sys
import gzip
import bz2
import optparse
import string
import shutil
import packagesList
import package
import ConfigParser

class   option_parser:
    
    def __init__(self):
    
        
        self.parser = optparse.OptionParser("usage: rmpkg.py [options] \n")
        
                                  
        self.parser.add_option("-p", "--package",
                          dest="deb", default=None,
                          type="string", help="full path of the package in the pool")
        self.parser.add_option("-r","--repo",
                          dest="repo", default=None,
                          type="string", help="root of the repository")
        self.parser.add_option("-d", "--dist", 
                          dest="dist", default=None,
                          type="string", help="name of the distribution")
        self.parser.add_option("-c", "--config",
                          dest="conf", default="/etc/poolmanager/repo.conf",
                          type="string", help="Especify the repo.conf file location")
        self.parser.add_option("-a", "--arch",
                          dest="arch", default="i386",
                          type="string", help="Especify the architecture")
                                           
    def parse_args(self):
        return self.parser.parse_args()
        
class remover:
    def __init__(self, repo, dist, deb, pool, apt_conf):
        
        self.repo = repo
        self.dist = dist
        self.deb = deb
        self.pool = pool
        self.apt_conf = apt_conf
        self.section = self.deb.split(os.sep)[1]
        #self.packages_file = os.path.join(os.sep, self.repo, 'dists', self.dist, self.section, self.arch, filename)
        #self.packages_location = 
         
        #Checking params
        print "raiz del repositorio...............%s"%self.repo
        print "pool...............................%s"%self.pool
        print "dist...............................%s"%self.dist
        print "section............................%s"%self.section
        print "deb................................%s"%self.deb
       
        
    def rmpackage(self):
        
        current_pkg = package.package()
        if self.deb.endswith('deb'):
            current_pkg.setBinary(True)
        elif self.deb.endswith('dsc'):
            current_pkg.setBinary(False)
        else:
            print "Error: Unknown file format"
            sys.exit(67)
        
        print "File: %s"%os.path.join(os.sep, self.repo, self.deb)
        current_pkg.importInfo(os.path.join(os.sep, self.repo, self.deb))
        
        architecture = None
        if current_pkg.isBinary():
			current_arch = current_pkg.get('Architecture')
			if current_arch == 'all':
				current_arch = 'i386'
			architecture = 'binary-%s'%current_arch
        else:
            architecture = 'source'            

        index_location = os.path.join(os.sep, self.repo, 'dists', self.dist, self.section, architecture)
        plist = packagesList.packagesList()
        print 'Index location: %s'%index_location
        file_content,index_file = self.getIndexContent(index_location)
                
        plist.loadInfo(file_content)
        #The package is searched by it's path in the pool
        result = plist.searchByName(self.deb, current_pkg.isBinary())
        
        if result:
            print "Localizando.............OK\nPath: %s"%self.deb
            plist.removePackage(result)
            print 'Index file: ' + os.path.join(os.sep, self.repo, 'dists', self.dist, self.section, architecture, index_file)
            plist.newFiles(os.path.join(os.sep, self.repo, 'dists', self.dist, self.section, architecture), current_pkg.isBinary())
            print "File removed from index....%s"%os.path.join(os.sep, self.repo, self.deb)
            #TODO: Keep the file in the pool if is included in any other dist
            if not current_pkg.isBinary():
                location = os.path.join(os.sep, self.repo, self.deb).split(os.sep)[:-1]
                path = os.sep.join(location)
                print "Path: " + path
                self.removeSourceFiles(path, current_pkg)
            elif current_pkg.isBinary() and os.path.exists(os.path.join(os.sep, self.repo, self.deb)):
                os.remove(os.path.join(os.sep, self.repo, self.deb))
                print "os.remove(%s)"%os.path.join(os.sep, self.repo, self.deb)
            else:
                print "Error: File not found"
                print "File: %s"%os.path.join(os.sep, self.repo, self.deb)
                sys.exit(39)
            done = True
        
        else:
            print "No se ha localizado el paquete....%s"%self.deb
            done = False
        return done
        
    def removeSourceFiles(self, path, package):
        files = package.get('Files')
        lines = files.splitlines()
        for line in lines:
            if len(line) > 1:
                line = line.split(' ')
                print os.path.join(os.sep, path, line[3])
                if os.path.exists(os.path.join(os.sep, path, line[3])):
                    os.remove(os.path.join(os.sep, path, line[3]))
                else:
                    print "Error: File not found"
                    print "File: %s"%os.path.join(os.sep, path, line[3])
                    sys.exit(38)
            
    def getIndexContent(self, path):
        file_content = None
        directory = os.walk(path)
        files = directory.next()[2]
        for file in files:
            if file.endswith('gz'):
                
                fd = gzip.open(path + os.sep + file,'rb')
                file_content = fd.read()
                fd.close()
                break
            elif file.endswith('bz2'):
                fd = bz2.BZ2File(path + os.sep + file,'rb')
                file_content = fd.read()
                fd.close()
                break
            else:
                if file == 'Sources' or file == 'Packages':
                    fd = open(path + os.sep + file, 'rb')
                    file_content = fd.read()
                    fd.close()
                    break
                else:
                    print "Error: Unknown index file format"
                    sys.exit(68)      
        return file_content, file
        
    def gen_Release(self):
        #apt config files should be named apt_'codename'.conf. The location can be changed in repo.conf
        
        conf = os.path.join(os.sep, self.apt_conf, 'apt_%s.conf'%self.dist)
        location = os.path.join(os.sep, self.repo, 'dists', self.dist)
        
        if not os.path.exists(conf):
            print "No se encuentra el fichero de configuración apt_%s.conf"%self.dist
        
        command = 'apt-ftparchive -c %s release %s > %s/Release'%(conf, location, location)
        os.system(command)
        print "Regenerado Releases..................." 
        
def main():
    parser = option_parser()
    (options,args) = parser.parse_args()
    del args
    
    if os.path.exists(options.conf):
        config = ConfigParser.ConfigParser()
        config.read(options.conf)
    else:
        print "\n\n\nError: no encuentro el fichero de configuración repo.conf\n\n\n "
              
    if not options.repo:
        repo = config.get('defaults', 'repositorio')
    else:
        repo = config.get('repositorios',options.repo)
    
    if not options.dist:
        dist = config.get('defaults', 'dist')
    else:
        dist = options.dist
    if not options.deb:
        print "No ha introducido nombre de paquete"
        sys.exit(35)
    else:
        deb = options.deb
    
    if options.arch:
        arch=options.arch
        
    pool = config.get('pools', dist)
    apt_conf = config.get('defaults', 'apt_conf')
    
    rm = remover(repo, dist, deb, pool, apt_conf)
    
    if rm.rmpackage():
        rm.gen_Release()
    
    
if __name__=='__main__':
    main()
    
