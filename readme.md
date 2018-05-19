# Coding-free iterating on email 

## License

[MIT](/LICENSE.md)

## Business aspects

Business ascepts have been presented in deatils [here](https://www.voucherify.io/blog/2016/12/14/coding-free-iterating-on-email-content).

In short: it's a sample application using [Contentful](https://www.contentful.com/) SaaS to fastly build a coding-free tool for emails' content management.

**NOTICE**: We are using this in production on daily basis and it works just perfect. It's giving us a possibility to work on Ops emails with almost no need for commiting/deploying, we only do that when there is a breaking change in the layout or new features are going to be released ;)

## Technical aspects

### Configuration

To setup your integration with Contentful you will have to modify `config/base.js` file. You should change two places:

- Contentful Service (`contentful/draft` and `contentful/published` keys); you should obtains the keys in your Contentful settings.
- Authorization configuration (`autorization/contentful` key), the value should be sent in Authorization header with Contentful Webhook request, it's configured in Contentful along with the webhook.

**NOTICE**: The config pattern in the app allows you to have multiple configuration files - environment or locale based - but at the beggining you can use it in a simple way:

```js
var config = require("./../config").current;
```

### General Desing

#### Contentful restrictions

There is a hardcoded value of content type's name that shuld be called `email` so that you have to name you content type in Contentful this way or change it in the code, it's up to you.

#### Email Container Engine

To use the email container in your system you should do the following:

```js
var EmailContainer  = require("./../services/email-container");
var emailContainer  = new EmailContainer({ container: "backup" });
```

The types of container are as follows:

- `backup`, data will be read from previously generated backup file stored as: `contentful-emails-backup.json`
- `cache`, data will be read from Memory Cached version. Cache is initialized on application start and refreshed when Contentful webhook reach the api endpoint.
- `contentful`, here you can additonally pass `type` attribute (`published` or `draft`) depends from which source you want to render. In this case data will be read directly from Contentful.

Then to render the file:

```js
emailContainer.render(util.format("welcome", customer.language), payload)
    .then((emailEntry) => {
        // emailEntry: { body: ... , subject: ..., etc. }
    });
```

To configure mapping between Contentful and available properties please look into `/service/email-container/index.js` file and check the `render` method.

#### Layouts

We decided to use [Swig](https://github.com/paularmstrong/swig) templating engine, because we had many good experiences with it in the past. For email rendering we use files stored in `front-end/views/emails` folder and you should store there all email related content to easily extend your layouts in the future.

The variables available during rendering can be configured in the `util/html.js`. As you can notice we have already preapred some basic useful variables and methods.

#### Parser

The parser class you can find here: `/services/email-container/parser`. It's a place where you can define spacial placehoders and thier transformations so that Content Manager can display dynamic data (undestand as payload used for rendering) inside the content, e.g.:

```
Hi [[customer-name]]
```

The list of needed placeholder should be discussed between developers and Content Managers. 

#### Cache & Webhook

The application provides simple Memory Cache mechanism. When application is started then published data is read from Contentful and stored in the memory. Whenever there is a publish/unpublish done in Contenful the Cache will be updated accordingly by configured webhook or after application is restarted.

### Tasks

In the project for running maintanance tasks we use [Gulp](http://gulpjs.com/).

#### Backup Contentful

Running the below command will endup downloading the published versions from Contentful and storing them in the file system: `files/contentful-emails-backup.json`. This file is used by `backup` email container to render the tempaltes.

```js
gulp contentful-backup
```

### Run the app

To run the app simple run the following command: 

```js
npm install
node server.js
```

The simply open in your browser: `http://localhost:3000` and then you can see content of your containers:

![Application Overview](/ApplicationOverview.png "Application Overview")

## Basic usage

**Developer**: 

- setup environment
- create and maintain layouts
- prepare new placeholders and partials views

**Content Manager**: 

- define entries in Contentful
- define placeholders for developer (e.g. "we need a button that allows to confirm registration")
- fix typos
- preapre the content (check always in draft mode how email looks like)
- publish ready emails so they are avaiaible in production right away
