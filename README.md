# TripTailor

Welcome to TripTailor, an innovative project made in the Wintersemester 2024/2025 during the Geoinformation in Society Course to enhance the travel experience for tourists. Our goal was to create solutions to address common challenges faced by travelers when planning trips to unfamiliar destinations.

## The Problem

Planning a trip can often be time consuming and stressful. Tourists being unfamiliar with their destinations often struggle to find the best route. Additionally, navigating through various transportation options can make the experience even worse.

## Our Solution

TripTailor is designed to save time and simplify the trip planning process by offering personalized and customized trip routes based on individual interests. Whether planning ahead or on the go, our platform provides seamless route navigation.

## Technologies
The Technologies used in TripTailor aim to provide a robust, scaleable and user friendly platform for the user.

### Frontend
- Vue3
- Vite
- Pinia
- Axios
- GSAP
- Bootstrap
- OpenLayers

### Backend
- Flask
- psycopg2 & PostGIS

### Database
- Based on kartoza/postgis:17-3.5
- osm2pgsql / lua
- docker, for consistencies for all team members

## Datasets/API's

- [basemap](https://basemap.de/) for detailed and up-to-date geographic maps of Germany
- [komoot](https://www.komoot.com/de-de) for geocoding and locating the start location
- [OpenRouteServices](https://openrouteservice.org/) for routing and navigation services 
- [OpenStreetMap](https://www.openstreetmap.org/relation/62591#map=13/51.96257/7.63721) data for Münster 

Please note that we've reduced the data size to focus primarily on Münster, allowing us to concentrate on refining the core functionalities.

## Configuration
-

## Step By Step Tutorial?
-

## Research Papers
Before diving into the implementation phase of our project, we thoroughly explored relevant literature to ensure that our approach was grounded on best practices. The following papers were relevant in shaping our understanding:

-  Vansteenwegen, P., & Van Oudheusden, D. (2007). The Mobile Tourist Guide: An or opportunity. *OR Insight, 20*(3), 21–27. [https://doi.org/10.1057/ori.2007.17](https://doi.org/10.1057/ori.2007.17)

-  Makris, A., Tserpes, K., Spiliopoulos, G., & Anagnostopoulos, D. (2019). Performance Evaluation of MongoDB and PostgreSQL for Spatio-temporal Data. *EDBT/ICDT Workshops*

-  Cybulski, P., & Horbiński, T. (2020). User experience in using graphical user interfaces of web maps. *ISPRS International Journal of Geo-Information, 9*(7), 412. [https://doi.org/10.3390/ijgi9070412](https://doi.org/10.3390/ijgi9070412)
-  Quercia, D., Schifanella, R., & Aiello, L. M. (2014). The shortest path to happiness. *Proceedings of the 25th ACM Conference on Hypertext and Social Media*. [https://doi.org/10.1145/2631775.2631799](https://doi.org/10.1145/2631775.2631799)

-  Brown, A., Emmer, N., & van den Worm, J. (2001). Cartographic Design and Production in the Internet Era: The Example of Tourist Web Maps. *The Cartographic Journal, 38*(1), 61–72. [https://doi.org/10.1179/000870401787312921](https://doi.org/10.1179/000870401787312921)


## Contact
Have questions, feedback, or ideas for the project? We'd love to hear from you!

## License

[MIT](https://choosealicense.com/licenses/mit/)