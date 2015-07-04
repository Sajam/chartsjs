import os
import re

path = os.path.dirname(os.path.abspath(__file__))
src_path = os.path.join(path, 'src')

f = open('charts.js', 'w')

for root, nodes, files in os.walk(src_path):
    if 'index.js' in files:
        index = open(os.path.join(root, 'index.js'), 'r').read()
        to_merge = re.findall(r'import (\'|")([^\'"]*)(\'|")', index, re.MULTILINE)

        for file_to_merge in to_merge:
            ftm = open(os.path.join(root, '{}.js'.format(file_to_merge[1])), 'r').read()
            f.write(ftm)

f.close()
