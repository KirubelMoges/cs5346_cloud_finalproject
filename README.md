
# Mustang-Go Services

Partly inspired by Amazon-Go, this is a Cloud Computing final project that integrates various features 
and 3rd party offerings to provide an advanced shopping experience to users. 



# Group Members

* Moges, Kirubel 
* Cox, Jarod
* Dubey, Sanjay




## Demo

The public link to this site can be found here: 

* https://frontendimage-7ayuqtevua-uc.a.run.app/

NOTE:

* During account creation, use the following credit card number.
* * Credit Card #: 4242 4242 4242 4242
* * Expiration Date: 04/24 or Any #
* * CVV Code: 242 or Any #
* * Zipcode: 42424 or Any #
* * The Credit card # is a provided by Stripe to be used for demo purposes. Please make sure to use this to prevent issues when testing.
* There's a 1-2 minute delay to load site due to cold start
* The site is due for termination at anytime & might not be available past end of semester


## Installation

Clone this project repo & navigate to the root of this project in your terminal, then:

```bash
  cd backend
  npm install
  node index.js
```

```bash
  cd frontend
  npm install
  npm start
```
    
## Documentation

This project makes use of the following services:

* Twilio API - SMS services
* AWS Rekognition - Facial recognition & indexing
* AWS Comprehend - Natural Language Processing, specifially extraction of adjective phrases
* GCP Language API - Natural Language Processing, specifially extraction of consumer good tagged items
* Stripe - Payment Processing in demo/test mode
* GCP Cloud Build & Cloud Run - Containerized application build & deployment
* Pexels API - Image retrieval based on extracted description
* Google Places API - predicted address retrieval

There's a .env.test file located in both frontend & backend directory. Their corresponding secrets have been
removed for security reasons, but you're welcome to create your own secret keys with the services listed in that file
and update the keys. Make sure to rename the .env.test file to .env for the key to be recognized. 

The application has been deployed on GCP Cloud Run using a CI/CD pipeline through github actions. The corresponding yaml file
can be found the the '.github/workflows' directory at the root of this project. This project utilizes github secrets to store
credentials needed to authenticate a successful deployement. 




## Features

- User profile linked to unique facial feature
- A secure Stripe based billing of customer's credit card at checkout
- Passwordless log in & shopping experience using AWS Rekognition for identification & Twilio for confirmation code retrieval
- Vision-based shopping experience powered by AWS Rekognition & GCP NLP engine
- Voice/Text-based shopping experience powered by AWS Comprehend & GCP NLP engine
- Simple One-Click Checkout
- Easy One-Click deletion of all user sensitive info 


## Possible Future Plans

* With additional funding, we could integrate a SERP API to retreive real product details instead of mock data used for this project.
* Unused screen real-estate can be better utilzed to generate AD revenue or provide a better user expereince

