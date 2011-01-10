#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Author: Junta de Andalucía <devmaster@guadalinex.org>
#  
# Code: Antonio González Romero <antonio.gonzalez.romero.ext@juntadeandalucia.es>


import apt_pkg
import apt_inst
import md5
import sys
import os
import gzip

from re import findall


'''This class keeps all information of a package as a  dict'''
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
            return 1
        
    '''Imports debian control fields info from .deb file'''
    def importDebInfo(self,path):
        
        file = open(path,"r")
        #Getting size from the file
        size = os.stat(path).st_size.__int__()
        #Getting md5sum
        content = file.read()
        file.close()
        md5_sum = md5.new(content).hexdigest()
        file = open(path,"r")
        try:
           debinfo = apt_pkg.ParseSection(apt_inst.debExtractControl(file))
           for key in debinfo.keys():
               value = debinfo.get(key)
               self.set(key, value)
        except:
            self.getFromDpkg(path)
        file.close()
        self.set('Size', size)
        self.set('MD5sum', md5_sum)
        
    '''Patch for olders python-apt libraries'''      
    def getFromDpkg(self,path):
        control_fields = ['Package', 'Source', 'Version', 'Section','Priority', 'Architecture', 'Maintainer','Pre-Depends',
              'Depends', 'Suggests', 'Breaks', 'Recommends', 'Enhances', 'enhances', 'Conflicts', 'Provides','Replaces',
               'Esential', 'Filename', 'Size', 'Installed-Size', 'MD5sum', 'Description', 'Uploaders', 'Bugs', 'Origin', 'Task']
        for key in control_fields:
            try:
                #print path
                #print key
                command = "/usr/bin/dpkg --field %s %s"%(path, key)
                #print command
                value = os.popen(command).read()
                if len(value) > 0:
                    self.set(key, value.strip())
                    #sys.stdout.write("%s: %s"%(key, value.strip()))
            except:
                print "Error lanzando dpkg"
                sys.exit(-20)   
        #sys.exit(1)
    '''Gets information from .dsc file of a source package'''
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

        #Insert .dsc file info (md5, size and file name)
        self.files.insert(0,' %s %d %s'%(md5_sum,size,file.split(os.sep)[-1]))
        self.set('Files','\n%s%s'%(self.files[0],self.get('Files')))
        
        priority, section = self.extractFromDiff(file)
        
        self.set('Section', section)
        if priority:
            self.set('Priority', priority)
        self.set('Package',self.get('Source'))
    
    '''Extract some information from diff.gz file if exists'''
    def extractFromDiff(self, path):
        #Get name of diff.gz file
        location = path.split(os.sep)[:-1]
        exists_diff = False
        priority,section = (None, 'main')
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
            try:
	    	priority = findall('Priority: .+\S',content)[0].split(':')[1].strip()
	        section = findall('Section: .+\S',content)[0].split(':')[1].strip()
	    except:
	    	pass
        
        return (priority,section)
                        

    def __cmp__(self, other):
        result = cmp(self.get('Package'), other.get('Package')) or cmp(self.get('Version'), other.get('Version'))
	return result
                
    def cmpVersion(self,other):
        return cmp(self.get('Version'), other.get('Version'))
