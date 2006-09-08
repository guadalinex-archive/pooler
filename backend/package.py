#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Author: Antonio González Romero <antonio.gonzalez.romero.ext@juntadeandalucia.es>



import apt_pkg
import apt_inst
import md5
import sys
import os
import gzip

from re import findall



class package:
    def __init__(self):
        #Dictionary for each package containing relevant information of the package.
        self.dict = {}
        #List with filenames in source package.
        self.files = []
        self.bin = True
        
    def getKeys(self):
        return self.dict.keys()
    
    def getDic(self):
        return self.dict
    
    def getFiles(self):
        return self.files
    
    def setBinary(self, bin):
        self.bin = bin
    
    def isBinary(self):
        return self.bin
        
    def hasKey(self,key):
        return self.dict.has_key(key)

    def set(self, key, value):
        self.dict[key] = value
    
    def get(self, key):
        value = None
        if self.dict.has_key(key):
            value = self.dict[key]
        return value
    
    def clear(self):
        self.dict.clear()
    
    def getFiles(self):
        return self.files
    #retrieve package information from .deb given
    
    def importInfo(self, file):
        if os.path.exists(file):
            if self.isBinary():
                self.importDebInfo(file)
            else:
                self.importDscInfo(file)
        else:
            print "Error: Especified file doesn't exists"
            print "File: %s"%file
            sys.exit(70)
        
    def importDebInfo(self,path):
        
        file = open(path,"r")
        #Getting size from the file
        size = os.stat(path).st_size.__int__()
        #Getting md5sum
        content = file.read()
        file.close()
        md5_sum = md5.new(content).hexdigest()
        file = open(path,"r")
        debinfo = apt_pkg.ParseSection(apt_inst.debExtractControl(file))
        file.close()
        self.set('Size', size)
        self.set('MD5sum', md5_sum)
        
        '''Import information from Control section'''
        for key in debinfo.keys():
            value = debinfo.get(key)
            self.set(key, value)
          
    def importDscInfo(self, file):
        
        fd = open(file,"r")
        size = os.stat(file).st_size.__int__()
        content = fd.read()
        fd.close()
        md5_sum = md5.new(content).hexdigest()
        lastKey = None
        
        lines = content.splitlines()
        for line in lines:
            if line.startswith('-') or ((len(line.split(':')) < 2) and not line.startswith(' ')):
                continue
            #line belong to files list in dsc.
            elif line.startswith(' '):
                self.set(lastKey,'%s\n%s'%(self.get(lastKey),line))
                self.files.append(line)
            else:
                key = line.split(':')[0].strip()
                value = line.split(':')[1].strip()
                lastKey = key
                if not self.dict.has_key(key):
                    self.set(key,value)

        #Insert .dsc file info

        self.files.insert(0,' %s %d %s'%(md5_sum,size,file.split(os.sep)[-1]))
        self.set('Files','\n%s%s'%(self.files[0],self.get('Files')))
        
        priority, section = self.extractFromDiff(file)
        
        self.set('Section', section)
        if priority:
            self.set('Priority', priority)
        self.set('Package',self.get('Source'))
    
           
    def extractFromDiff(self, path):
        #Get name of diff.gz file
        location = path.split(os.sep)[:-1]
        exists_diff = False
        for file in self.files:
            file_name = file.split(' ')[3]
            if file_name.endswith('diff.gz'):
                location.append(file_name)
                exists_diff = True
                break
        if exists_diff:
            filename = os.sep.join(location)
            fd =  gzip.open(filename,'rb')
            content = fd.read()
            fd.close()
            priority = findall('Priority: .+\S',content)[0].split(':')[1].strip()
            section = findall('Section: .+\S',content)[0].split(':')[1].strip()
        else:
            priority = None
            section = 'main'
        
        return (priority,section)
                        
    def __cmp__(self, other):
        result = cmp(self.get('Package'), other.get('Package')) or cmp(self.get('Version'), other.get('Version'))
	return result
                
    def cmpVersion(self,other):
        return cmp(self.get('Version'), other.get('Version'))