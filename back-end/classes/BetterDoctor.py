import requests
import json
import time
import calendar
from . import config
from dateutil.rrule import DAILY, rrule, MO, TU, WE, TH, FR
from datetime import date
from random import randint



class BetterDoctor:

    def __init__(self, latitude, longitude, range=20):
        self.url = "https://api.betterdoctor.com/2016-03-01/doctors?"
        self.specialty_uid = "general-practitioner"
        self.location = str(latitude)+"%2C%20"+str(longitude)+"%2C"+str(range)
        self.skip = "0"
        self.limit = "10"
        self.user_key = "9e80ab6d9caec1cc002ff28884148266"

    def getDoctor(self, specialty="general-practitioner"):
    	doctors = []
    	for doctor in self._loadFromWebService(config.betterDoctorUID[specialty])["data"]:
    		visit = doctor["practices"][0]["visit_address"]
    		info = {'Name': doctor["profile"]["first_name"] + " " +doctor["profile"]["last_name"],
    		        'Location': doctor["practices"][0]["name"] + " at " + visit["street"] + ", " + visit["city"] + ", " + visit["state"] + " " + visit["zip"],
                    'Distance': doctor["practices"][0]["distance"],
    		        'Availability' : [self.getAvailability(), self.getAvailability(), self.getAvailability()],
                    'Phone' : doctor["practices"][0]["phones"][0]["number"]
                    }
    		doctors.append(info)
    	return doctors


    def getAvailability(self):
    	index = randint(0, 20)
    	hour = randint(9, 16)
    	dates = self._daterange(date(2017, int(time.strftime("%m")), 28),
    	date(2017+1 if (int(time.strftime("%m"))+2 > 12) else 2017, int(time.strftime("%m"))+2, 28))
    	return {'Date' : calendar.month_name[dates[index].month] + " " + str(dates[index].day) + " " + str(dates[index].year),
    	'Time' : str(hour) + ":00"}

    def _daterange(self, start_date, end_date):
    	return list(rrule(DAILY, dtstart=start_date, until=end_date, byweekday=(MO,TU,WE,TH,FR)))

    def _loadFromWebService(self, specialty):
    	url = self.url+"specialty_uid="+specialty+"&location="+self.location+"&skip="+self.skip+"&limit="+self.limit+"&user_key="+self.user_key
    	response = requests.get(url)
    	try:
    		response.raise_for_status()
    	except requests.exceptions.HTTPError as e:
    		print ("----------------------------------")
    		print ("HTTPError: " + e.response.text )
    		print ("----------------------------------")
    		raise

    	try:
    		dataJson = response.json()
    	except ValueError:
    		raise requests.exceptions.RequestException(response=response)

    	data = json.loads(response.text)
    	return data
