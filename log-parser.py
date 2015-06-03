# collect and display data from log file

import matplotlib.pyplot as pyplot
import csv

# dictionary to track data values
data = {
	' 0' : 0,
	' 1' : 0,
	' 2' : 0
}

# open raw data file
with open("output.txt") as f:
	reader = csv.reader(f)
	for line in reader:
		# check for activity level and add to data dict
		data[ line[4] ] = data[ line[4] ] + 1

print data

values = data.values()
keys = [ "High Activity", "Resting", "Low Activty" ]
colors = ['green', 'lightskyblue', 'yellowgreen']

pyplot.axis("equal")
pyplot.pie(
        values,
        labels=keys,
        colors=colors,
        autopct="%1.1f%%"
        )
pyplot.title("Chloe's Activity")
pyplot.savefig("plot.png")
pyplot.show()