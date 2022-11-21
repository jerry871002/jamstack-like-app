# Project 2 report

## Get Started

### Prerequisite
Before running the application, please install the following tools

- Docker ([Install Guide](https://docs.docker.com/get-docker/)): to run the application
- k6 ([Install Guide](https://k6.io/docs/get-started/installation/)): to run performance tests

### Start the Application

Open a terminal at the root folder of this project, then use `docker compose up --build` to start the application. For the first start, it might take up to three minutes for the application to fully start. Make sure you see the `flyway` service exit successfully before starting to use the application.

There might be some errors popping out in the `grader` service while starting, this is because it tries to connect to `rabbitmq` before it is ready. The `grader` service will automatically restart until the connection is made, so just wait for a couple minutes, it's not breaking.

After everything is ready, visit [http://127.0.0.1:7800](http://127.0.0.1:7777) to start using the application.

### Using the Application

In the main page, there is a list of exercises for you to attempt. Notice that there are actually in total **eight** exercises in total, but "Unsolved" list will show at most **three** at once. You can navigate to the exercise page by clicking the item in the lists.

In the exercise page, there are the description of the exercise, a textarea for you to enter the solution, and a submit button to submit the solution. Try entering something in the textarea and press the submit button. After pressing it, a hint text of "Grading" will show up next to the button. The grading process might take up to 30 seconds, after the grading is done, an alert will pop out to inform the result (either "PASS", "FAIL" or "ERROR").

Notice that you cannot submit the exact same solution twice. You can verify this by clicking the submit button again without modifying the solution.

Once you receive the result, you can navigate back to the main page using the link at the bottom of the page. The exercise you just attempted will be listed in the correct category and a new exercise will appear in the "Unsolved" list.

## Run Performance Tests

Before running the performance tests, make sure the application is running.

First, `cd` into the `tests/` directory, you can use `./test.sh` to run all the tests at once (remember to ensure that `test.sh` is an executable) or run the test one-by-one by `k6 run <test-name>.js` (check the content of `test.sh` to find out what test you can run).

## Core Web Vitals and Performance Test Results

### Lighthouse Performance Score

| Page | Score | Largest Contentful Paint | First Contentful Paint | Cumulative Layout Shift |
|----------------|---------------------:|-------:|----------------:|----------------:|
| Main Page | 100 | 0.5s | 0.2s | 0.014 |
| Exercise Page | 100 | 0.4s | 0.2s | 0 |

### Performance Test Results

| Endpoint | Avg requests per sec | Median | 95th percentile | 99th percentile |
|----------------|---------------------:|-------:|----------------:|----------------:|
| Main Page | 9.338698 | 59.17ms | 112.66ms | 123.06ms |
| Submit Exercise | 9.306942 | 65.56ms | 102.33ms | 104.78ms |

## Reflection

The performance of the system is quite good since there are no fancy style or complex UI components at the moment. And also because astro pre-rendered most of the content, there is not much overhead in the client side. But since I am manipulating the main page using JavaScript according to some data fetched from the API service, if the API service grows bigger and the fetch command takes some noticable time, this might affect the user experience. The bottleneck of the current system is when many submissions come in at once, it takes quite some time for the grader to build and run containers for each submission.

## Suggestions

I might need to control the number of containers the grader is running simutaneously to prevent system crash due to using to many resources. Also, I am currently always fetching data from the api service to make sure which exercise is completed. This can be optimize to only fetch new data once the user gives an attempt to some exercises. Last but not least, I should add real-world style and interactive components before really tuning the performance since it's currently too simple to have any performance bottleneck on the client side.