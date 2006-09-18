#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Author: Junta de Andalucía <devmaster@guadalinex.org>
#  
# Code: Antonio González Romero <antonio.gonzalez.romero.ext@juntadeandalucia.es>

import package
import os
import sys
import md5
import bz2
import gzip
import re


'''This class keeps a data estructure with information in Packages/Sources index files'''
class packagesList:
    def __init__(self):
        self.pkg_list = []
        
    def num_elements(self):
        return len(self.pkg_list)
        
    '''Index file parser'''
    def loadInfo(self, content):
       
        lines = content.splitlines()
        del content
        
        #keeps the last key in use. 
        lastkey = None
        pkg_info = package.package()
        
        for line in lines:
           
            #New package info
            if len(line) == 0 :
                self.pkg_list.append(pkg_info)
                pkg_info = package.package()
            #Multiline info
            #TODO: Update files list
            elif line.startswith(' '):
                key = lastkey
                value = pkg_info.get(key)
                value +=  '\n%s'%line
                pkg_info.set(key, value)
            
            else:
                #get key
                splited_line = line.split(':',1)
                if len(splited_line) > 1:
                    value = splited_line[1].strip()
                else:
                    print "Bad line:_____%s______"%line
              
                key = splited_line[0].strip()
                pkg_info.set(key,value)
                lastkey = key
        del lines
        
    def addPackage(self, package):
        if not self.searchPackage(package):
            self.pkg_list.append(package)
            self.pkg_list.sort()
            print "Package %s added to the repository..................."
        else:
            print "The package already exists in the repository"
        
    def searchPackage(self, package):
        
        exists = False
        for current in self.pkg_list:
            cmp = package.__cmp__(current)
            if not cmp:
                print "Success searching\tName: %s, Version: %s"%(current.get('Package'),current.get('Version'))
                exists = True
                break
            else:
                continue
        return exists
    
    def searchByName(self,name, bin):
        
        #receives the full path of the package in the index file
        result = None
        print "Searching for: %s"%name
        print "len(pkg_list)= %d"%len(self.pkg_list)
        
        for current in self.pkg_list:
            if bin and cmp(current.get('Filename').strip(),name) == 0:
                print 'Searching binary %s'%name
                result = current
                break
            elif not bin:
                name = name.split(os.sep)[-1]
                print 'Searching source %s'%name
                print 'Name: %s'%name
                files = current.get('Files')
                print 'Files content: %s'%files
                result = current
                break
        return result
                
    def removePackage(self,package):
        if self.searchPackage(package):
            self.pkg_list.remove(package)
            print "Package %s removed from the repo"%package.get('Package')[:-1]
        else:
            print "El paquete no se encuentra en el repositorio"
    
    def newFiles(self, out, binary):
        if binary:
            file = 'Packages'
        else:
            file = 'Sources'
        new_fd = open (out + os.sep + file, "w", os.O_CREAT)
        if binary:
            control_fields = ['Package', 'Source', 'Version', 'Section','Priority', 'Architecture', 'Maintainer','Pre-Depends',
                          'Depends', 'Suggests', 'Recommends', 'Enhances', 'enhances', 'Conflicts', 'Provides','Replaces',
                           'Esential', 'Filename', 'Size', 'Installed-Size', 'MD5sum', 'Description', 'Uploaders', 'Bugs', 'Origin', 'Task', '']
        else:
            control_fields = ['Package', 'Binary', 'Version', 'Priority', 'Section', 'Maintainer', 'Build-Depends',
                              'Build-Depends-Indep', 'Build-Conflicts', 'Build-Conflicts-Indep', 'Architecture',
                                'Standards-Version', 'Format', 'Directory', 'Files', 'Uploaders', 'Bugs', 'Origin', 'Task', '']
        for package in self.pkg_list:
            for k in control_fields:
                if package.hasKey(k):
                    new_fd.write("%s: %s\n"%(k, package.get(k)))
            new_fd.write('\n')
        new_fd.close()
        self.gen_compressed(out + os.sep + file, binary)
    
    def gen_compressed(self, file, binary):
            
        fd = open (file,"r")
        content = fd.read()
        fd.close()
                
        gz_file = gzip.open("%s.gz"%file, "wb")
        gz_file.write(content)
        gz_file.close()
        
        if binary:
            bz2_file = open("%s.bz2"%file, "w", os.O_CREAT)
            bz2_file.write(bz2.compress(content))
            bz2_file.close()
        else:
            os.system('rm %s'%file)

        
        del content
                 

#Testing module
#if __name__=='__main__':
#    file = open ('/home/agonzalez/repo/debs/Sources',"r")
#    sources = packagesList()
#    sources.loadInfo(file)
#    print 'Número de paquetes fuente en el repo: %d'%sources.num_elements()
#    
#    pk = package.package()
#    pk.importDscInfo('/home/agonzalez/Desktop/sources/magnus_4.1.1-beta-7.dsc')
#    sources.addPackage(pk)
#    sources.newFiles('/tmp/Sources', False)
#    
#    del pk
#    del sources
#    
#    file = open ('/home/agonzalez/repo/debs/Packages',"r")
#    sources = packagesList()
#    sources.loadInfo(file)
#    print 'Número de paquetes fuente en el repo: %d'%sources.num_elements()
#    pk = package.package()
#    pk.importDebInfo('/home/agonzalez/workspace/debs/poolmanager_0.8-1_i386.deb')
#    sources.addPackage(pk)
#    sources.newFiles('/tmp/Packages', True)
#       
   
    
