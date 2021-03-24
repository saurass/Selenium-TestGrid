# Selenium-TestGrid
#### A test grid that mimics Browserstack and LambdaTest and helps you record videos of your selenium tests

Developed 2 methods which achives our objective (80% - 90%). Built a system providing some basic functionalities of LambdaTest.

## Primary Objectives

* The system must host a selenium grid that we can connect to execute our tests on each build.

* A video must be recorded and saved for reference.

* Slack Notification in case of test fail.

## Secondary Objectives

* We should be able to execute our tests in parallel, so that build takes lesser time.

## Major Challenge

* Video recording is the main challenge (discovered 2 working methods for this).

## Approach

* We develop a microservice that has the responsibility of recording videos from the tests being executed.

* Here is a flow diagram how our infrastructure will look like.
![Selenium Grid Architecture](http://saurass.in/src/resources/assets/assets/images/selenium.jpg)

#### The Screen Recorder can work in two ways.

## Method 1

* Host a MJPEG server alongside Selenium server on windows system.

* Use FFMPEG to capture screenshots from here and render it as video

### Issues-

* System method only works when RDP connection is alive with the windows server/GUI is available.

## Method 2

* Connect The Recorder service with same selenium session and keep taking screenshots.

* Use FFMPEG to render a video from these images later.

### Issues-

* To cope up with the quality of video, the video speed with be approx 2.5X (we can slow it down while watching : ) )

## Overall System Requirement-

* System requirement mostly depends on parallelism.

* Still we require atleast core system and atleast 2 GB RAM.
