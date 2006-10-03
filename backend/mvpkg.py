#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Author: Junta de Andalucía <devmaster@guadalinex.org>
#  
# Code: Antonio González Romero <antonio.gonzalez.romero.ext@juntadeandalucia.es>

import optparse
import ConfigParser
import os
import shutil
import rmpkg
import addpkg

def __init__(self, options):
        
        
        if os.path.exists(options.conf):
            config = ConfigParser.ConfigParser()
            config.read(options.conf)
        else:
            print "\n\n\nError: no encuentro el fichero de configuración repo.conf\n\n\n "
        
        self.source = options.deb
        self.destination = options.dist
        self.repo = config.get('defaults', 'repositorio')
        
        file_path = os.path.join(os.sep, self.repo, self.source)
        print "File absolute path..........%s"%file_path
        if os.path.exists(file_path):
            #Create a temporal file
            shutil.copy(file_path,'/tmp/') 
    

        
def main():
    

    parser = optparse.OptionParser("mvpkg -p <source> -o <source dist> -d <destination dist> \n")
    parser.add_option("-p", "--package",
                          dest="deb", default=None,
                          type="string", help="full path of the package in the pool")
    
    parser.add_option("-d", "--destdist", 
                          dest="destdist", default=None,
                          type="string", help="name of the dist where the pack will be added")
    
    parser.add_option("-o", "--sourcedist", 
                          dest="srcdist", default=None,
                          type="string", help="name of the dist where the package will be removed from")
    
    parser.add_option("-r","--repo",
                           dest="repo", default=None,
                           type="string", help="repository path ")
    
    parser.add_option("-c", "--config",
                          dest="conf", default="/home/admin/pooler/conf/repo.conf",
                          type="string", help="Especify the repo.conf file location")
    parser.add_option("-a", "--arch",
                          dest="arch", default="i386",
                          type="string", help="Especify the architecture")

        
    (options,args)=parser.parse_args()
    del args
    
    
    config = ConfigParser.ConfigParser()
    try:
	config.read(options.conf)
    except:
        print "\n\n\nError: There is no repository config file (/etc/repo.conf?)\n\n\n "
        sys.exit(20)
    if not options.deb:
        print "No package name was given"
    if not options.srcdist:
        print "No destination distribution was especified"
        srcdist = config.get('defaults', 'dist')
    else:
        srcdist = options.srcdist
    
    if not options.destdist:
        print "No source dist was especified"
        print "The package will be added to the especified location but it will not be removed from source"
    
    if not options.repo:
    	name = config.get('defaults','repositorio')
	repo = config.get('repositorios', name)
    else:
        name = options.repo
	repo = config.get('repositorios', name)
    try:
        gid = int(config.get('defaults', 'gid'))
    except:
	gid = os.getgid()
    print '#debugging: repository: %s'%repo
    pool = config.get('pools', name + '.' + options.destdist)
    apt_conf = config.get('defaults', 'apt_conf')
    print '\Poooooool: %s'%pool 
    #Compose de path to the debian package
    deb = os.path.join(os.sep, repo, options.deb)
    print "debian package path: %s"%deb
    
    print "\%s"%repo
    print "\%s"%options.destdist
    print "\%s"%deb
    print "\%s"%pool
    
    print "add data: %s; %s; %s; %s; %s"%(repo, options.destdist, deb, pool, apt_conf)
    add = addpkg.adder(repo, options.destdist, deb, pool, apt_conf, gid)
    
    if add.add_package():
        add.gen_Release()
        print '\n\n\nPackage added successfully.....\n'
    
    location_info = options.deb.split(os.sep)
    
    pool = config.get('pools', name + '.' + options.srcdist)
    
    print '\n\n\n\n'
    
    print "\%s"%repo
    print "\%s"%srcdist
    print "\%s"%deb
    print "\%s"%pool
    
    
    print "rm data: %s; %s; %s; %s; %s"%(repo, srcdist, options.deb, pool, apt_conf)
      
    rm = rmpkg.remover(repo, options.srcdist, options.deb, pool, apt_conf, options.arch)
    if rm.rmpackage():
        rm.gen_Release()
        print '\n\n\nPackage removed successfully.....'
     
         
    

if __name__=='__main__':
    main()
    
