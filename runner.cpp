#include <iostream> 
#include <stdlib.h>
#include <stdio.h>
#include <ctype.h> 
#include <csignal> // needed for catching SIGINT
#include <ctime> //time helper
#include <dirent.h> //directory manipulation
#include <string> // used for names of files
#include <vector>  
#include <fstream> //file manipulation library


using namespace std;

//function prototype
void signalHandler(int);

int main (void)
{
	
	int exitCode = 0;
	int doOnce = 1;
	char option = ' ';
	
	// register signal SIGINT and signal handler 
	signal(SIGINT, signalHandler); 
	
	while(1){ // keep running loop until SIGINT is catched
		while (exitCode == 0 || exitCode == 256) { // if the code returned is 0 or 1(256) search for device again
			cout <<"Press CTRL + C at any time to end program.\n"<< endl; 
			exitCode = system("sudo node meowfit_logger.js"); // store the exit code in a variable that keeps loop running
			cout << "Exit Code: "<< exitCode << "\n"<< endl;//for troubleshooting purposes
			
			if (exitCode == 0 || exitCode == 256) //reconnecting message if needed
				cout <<"Reconnecting.."<< endl;
		}
		
		if (doOnce) //do this if SIGINT is catched from javascript program
		{
			cout << "End Program? \n (Press Y to confirm N to continue)" << endl;
			cin >> option; 
			(tolower(option) == 'y') ? doOnce-- : exitCode = 0;		//keep looping if user wants
		}
		else
		{
			kill(getpid(), SIGINT); //otherwise kill the program but close cleanly by SIGINT handler
		}
		
	}
	

return 0;
}


void signalHandler( int signum ){ //should the user want to end the process
	cout <<"Exit Code " << signum << " received.\n";
	cout << "Closing.." << endl;
	
	vector <string> todaysDates; // Will keep today's logs
	todaysDates.reserve(3);
	//find the time based on the system
	DIR *dpdf;
	struct dirent *epdf;
	int year = 0;
	int month = 0;
	int day = 0;
   // current date/time based on current system
   time_t now = time(0);
   tm *ltm = localtime(&now);

   //store the timein variables
	year = 1900 + ltm->tm_year;
	month = 1 + ltm->tm_mon;
	day = ltm->tm_mday; 
	
	//debugging purposes
	//cout << year << " " << month << " " << day << endl;
	
	//open the directory 
	dpdf = opendir("/home/pi/meowfit/data");
	if (dpdf != NULL){
		while (epdf = readdir(dpdf)){ //look at the files in it
			

			string nameOfFile = epdf->d_name; //look at each name
			//cout << nameOfFile << endl;
			//cout << nameOfFile.length() << endl;
			
			if (nameOfFile.length()  == 32) { //and if it is a JSON length file
				
				//cout << nameOfFile << "Passed" << endl;

				//store the year, month and day
				string yearStr = nameOfFile.substr(0,4);	
				string monthStr = nameOfFile.substr(5,7);
				string dayStr = nameOfFile.substr(8,10);
				
				//cout << atoi(yearStr.c_str()) << " " << atoi(monthStr.c_str()) << " " <<  atoi(dayStr.c_str()) << endl;
			
				if ( (atoi(yearStr.c_str()) == year ) && (atoi(monthStr.c_str()) == month) && (atoi(dayStr.c_str())== day) ) //and check if they're today's date
				{
					//cout << "This is from today" << endl;
					//cout << nameOfFile<< endl;
					todaysDates.push_back(nameOfFile); //if so, add it to the vector
				}//end if
			}//end if
		}//end while
	} //end if
	
	cout <<"Number of files to merge: "<< todaysDates.size() << endl; 
	cout << "Files to merge: " << endl;
	for (unsigned i=0; i<todaysDates.size(); i++)
		cout << ' ' << todaysDates.at(i) << endl;
	//cout << todaysDates.size()

	if (todaysDates.size() > 1)
	{
		//Merge the files						
	}
	
	//clean exit
	exit(signum); 
}
