import os
import fnmatch
import json

matches = {} 
for root, dirnames, filenames in os.walk('./videogame'):
	  for filename in fnmatch.filter(filenames, '*.txt'):
			f = open(os.path.join(root, filename), 'r')
			data = f.read()
			f.close()
			
			game = root.replace("./", "").split('/')[-1]

			if not game in matches:
				matches[game] = []
			matches[game].append(data)	

f = open('./tones.json', 'w')
f.write(json.dumps(matches))
f.close()

