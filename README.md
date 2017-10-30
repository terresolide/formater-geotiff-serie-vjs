# formater-skeleton-component-vjs


Just a component with a button used to begin a component

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for preproduction with minification
npm run pre

# build for production with minification
npm run build


```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Configuration
Use your own repository by editing package.json in particular `name`, `version`, `main`, `preproduction.url` and `production.url` used to build js files:

``` json
  "name": "formater-skeleton-vjs",
  "version": "0.0.1",
  "preproduction": {
	  "url": "https://rawgit.com/terresolide/"
  },
  "production": {
     "url": "https://cdn.rawgit.com/terresolide/"
  },

```



## Example 
```

  <formater-skeleton  ></formater-skeleton>
  <script src="https://cdn.rawgit.com/terresolide/formater-skeleton-vjs/0.0.1/dist/formater-skeleton-vjs_0.0.1.js"></script> 

