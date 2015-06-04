# collect and display data from log file

import matplotlib.pyplot as pyplot
import csv
import os

# dictionary to track data values
pieChartData = {
	' 0' : 0,
	' 1' : 0,
	' 2' : 0
}

# lists to track count per hour
stackedBarData0 = [0] * 24
stackedBarData1 = [0] * 24
stackedBarData2 = [0] * 24

for filename in os.listdir(os.getcwd() + '/data'):
	print filename

	# open raw data file
	with open('./data/' + filename) as f:
		reader = csv.reader(f)
		for line in reader:
			if line[0][0:10] == '2015-06-03':
				# check for activity level and add to pie chart data dict
				pieChartData[ line[4] ] = pieChartData[ line[4] ] + 1

				# update bar chart data
				key = int(line[0][11:13])

				if line[4] == ' 0':
					stackedBarData0[key] += 1
				if line[4] == ' 1':
					stackedBarData1[key] += 1
				if line[4] == ' 2':
					stackedBarData2[key] += 1


values = pieChartData.values()
keys = [ "High Activity", "Resting", "Low Activty" ]
colors = ['green', 'lightskyblue', 'yellowgreen']

# pie chart percentage of activity
pyplot.figure(1)
pyplot.axis("equal")
pyplot.pie(
        values,
        labels=keys,
        colors=colors,
        autopct="%1.1f%%"
        )
pyplot.title("Chloe's Activity\n6/3/2015 12:00am-11:59pm")
pyplot.savefig("pie-plot.png")

# bar chart by hour
pyplot.figure(2)

x = range(24)

pyplot.bar(x, stackedBarData1, align='center', color='yellowgreen')
pyplot.bar(x, stackedBarData2, align='center', color='green', bottom=stackedBarData1)
pyplot.xticks(xrange(24))

pyplot.show()