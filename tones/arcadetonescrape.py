from BeautifulSoup import BeautifulSoup as Soup
from soupselect import select
import urllib
import re   
import os


def scrapeConsolePage(page):
	soup = Soup(urllib.urlopen(page))
	links = select(soup, 'td a[target="_blank"]')

	hrefs = []

	for link in links:
		hrefs.append(link['href'])

	hrefs = list(set(hrefs))

	for link in hrefs:
		print link
		link = 'http://arcadetones.emuunlim.com/' + link
		scrapeGamePage(link)

def scrapeGamePage(link):
	soup = Soup(urllib.urlopen(link))
	titles = select(soup, 'td font[color="#ffffff"]')
	gameTitle = ""
	for title in titles:
		title = title.getText()
		gameTitle = re.sub("\s+"," ",title)

	os.mkdir('./videogame/' + gameTitle)

	songs = select(soup, 'textarea')
	for song in songs:
		song = song.getText()
		if 'Tempo:' in song:
			continue
		songTitle = song.split(':')[0]	

		f = open('./videogame/' + gameTitle + '/' + songTitle  + ".txt", 'w')
		f.write(song)
		f.close()

#scrapeConsolePage('http://arcadetones.emuunlim.com/nes.htm')
#scrapeConsolePage('http://arcadetones.emuunlim.com/snes.htm')
scrapeConsolePage('http://arcadetones.emuunlim.com/dc.htm')
scrapeConsolePage('http://arcadetones.emuunlim.com/psx.htm')
scrapeConsolePage('http://arcadetones.emuunlim.com/c64.htm')
scrapeConsolePage('http://arcadetones.emuunlim.com/amiga.htm')
scrapeConsolePage('http://arcadetones.emuunlim.com/pc.htm')
scrapeConsolePage('http://arcadetones.emuunlim.com/misc.htm')
scrapeConsolePage('http://arcadetones.emuunlim.com/ffantasy.htm')
scrapeConsolePage('http://arcadetones.emuunlim.com/ddr.htm')
