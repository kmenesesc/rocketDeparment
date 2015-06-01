# collect and display data from log file

dataPoints = 0
movementTrue = 0
movementFalse  = 0

with open("log-alpha.txt") as f:
	for line in f:
		if "movement" in line:
			dataPoints = dataPoints + 1
			
			if "true" in line:
				movementTrue = movementTrue + 1
			else:
				movementFalse = movementFalse + 1

print "Number Data Points: ", dataPoints
print "Moving: ", movementTrue
print "Resting: ", movementFalse
print
print "Percentage Moving: ", (float(movementTrue)/float(dataPoints)) * 100