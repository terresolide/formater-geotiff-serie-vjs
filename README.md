# formater-geotiff-serie-vjs


A component to display geotiff serie using their thumbnail, 

![Screenshot](/images/screenshot1.png)



## Use
 
 In your html page add the component and the script like this:  
 
 ```html
 <formater-geotiff-serie metadataurl="url_to_your_metadata_file.json" lang="en" attribution="true"></formater-geotiff-serie>  
 <script src="https://cdn.rawgit.com/terresolide/formater-geotiff-serie-vjs/0.4.3/dist/formater-geotiff-serie-vjs.js"></script>
 ```
 
 Where 
 * `metadataurl` is a json file describing your serie, (specifications @inprogress)
 * `lang` is the code language `fr` or `en`
 * `attribution` is a boolean to display or hide the attribution line
 
## Dev