#!/usr/bin/env python
# -*- coding:utf-8 -*-

# ID=1298 python scm_template.py
# author: huangjian

import sys
import os
import requests
import tarfile
import urllib2

RECENTLY = os.getenv("NUM", 10)
REPOS_ID = os.getenv("ID", 3552)

class ScmResource(object):
  def __init__(self, id, limit, dist='dist'):
    self.repos_name = ''
    self.download_id = ''
    self.latest_version = ''
    self.choose_resource = ''
    self.id = id
    self.limit = limit
    self.dist = dist
    self.repos = 'http://scm.byted.org/api/repos/{id}'
    self.version = 'http://scm.byted.org/api/repos/{id}/versions'


  def split_line(self, num=32):
    return '=' * num


  def untar(self, fname, dist):
    """ extract tar file """
    t = tarfile.open(fname)
    t.extractall(path=dist)


  def check_version_list(self, version, all_list):
    for line in all_list:
      if version in line.values():
        return True
    return False


  def get_repos(self):
    """ request scm repos with id """
    url = self.repos.format(id=self.id)
    try:
      r = requests.get(url, params={}, timeout=30)
    except requests.RequestException as e:
      r.raise_for_status()
      print e
    else:
      request = r.json()
      print self.split_line(91)
      for index, info in enumerate(request):
        repos_name = info['name']
        git_url = info['git_url']
        desc = info['desc']
        print 'Name: {0}'.format(repos_name)
        print 'Url : {0}'.format(git_url)
        print 'Desc: {0}'.format(desc)
      repos_name_list = repos_name.split('/')
      self.repos_name = repos_name_list[len(repos_name_list) - 1]
    self.get_build_version(self.id)


  def review_tar_info(self, verison_list, resource):
    """ download repos version, defualt for lastest """

    your_choose = raw_input(
      "Which version did you want to download (default: {0}), or press 'q' to exit:".format(self.latest_version))

    if self.check_version_list(your_choose, verison_list):
      self.download_id = your_choose
    elif your_choose == '':
      self.download_id = self.latest_version
    else:
      print "GoodBye!"
      return

    self.choose_resource = resource[self.download_id]

    # ----------------------- 打印下载信息开始 -----------------------
    print self.split_line(92) + '\n'
    print '发布版本：', self.choose_resource["version"]
    print '发布类型：', self.choose_resource["type"]
    print "资源包名：", self.choose_resource["filename"]
    print '资源地址：', self.choose_resource["tar_url"]
    print '创建时间：', self.choose_resource["create_date"]
    print '哈希值  ：', self.choose_resource["hash"]
    print '发布人  ：', self.choose_resource["create_user"]
    print '项目描述：', self.choose_resource["desc"]
    print self.split_line(92)
    # ----------------------- 打印下载信息结束 -----------------------

    self.download_tar_file(self.choose_resource)

  def fetch_file(self, result):
    print "Start download......"
    f = urllib2.urlopen(result['tar_url'])
    data = f.read()
    file_name = result['filename']
    version = result['version']
    with open(file_name, "wb") as code:
      code.write(data)
    if os.path.exists(file_name):
      self.untar(file_name, self.dist + '/{0}/{1}'.format(self.repos_name, version))
      os.remove(file_name)
      print "Successfully!"


  def download_tar_file(self, result):
    confirm = raw_input("Are your sure download {0} (y/n) ?\n".format(result["filename"]))
    if confirm == 'y' or confirm == '':
      if os.path.exists(self.dist + '/{0}/{1}'.format(self.repos_name, self.download_id)):
        print result['filename'] + ' exist!'
      else:
        self.fetch_file(result)
    else:
      print "GoodBye!"
      return


  def get_build_version(self, id):
    """ request a repos with version """
    version_url = self.version.format(id=id)
    try:
      r = requests.get(version_url, params={}, timeout=30)
      r.raise_for_status()
    except requests.RequestException as e:
      print e
    else:
      result = r.json()
      resource = {}
      verison_item = []
      for index, build_info in enumerate(result):
        if build_info['status'] == 'build_ok':
          resource[build_info["version"]] = {
            "create_date": build_info["create_date"],
            "filename": build_info["bin_path"],
            "type": build_info["type"],
            "version": build_info["version"],
            "desc": build_info["desc"],
            "create_user": build_info["create_user"],
            "tar_url": build_info["tar_url"],
            "hash": build_info["base_commit_hash"]
          }
          verison_item.append({
            "version": str(build_info["version"]),
            "type": build_info["type"],
          })
      self.latest_version = verison_item[0]["version"]
      # print the result
      print self.split_line() + ' VERSION LIST (* : online) ' + self.split_line()

      # mark the online tag
      for num, line in enumerate(verison_item):
        if num < int(RECENTLY):
          if line['type'] == 'online':
            print '{0} *'.format(line['version'])
          else:
            print line['version']

      print self.split_line(91)

      self.review_tar_info(verison_item, resource)


if __name__ == "__main__":
  reload(sys)
  sys.setdefaultencoding('utf-8')
  scm_resource = ScmResource(REPOS_ID, RECENTLY)
  scm_resource.get_repos()
