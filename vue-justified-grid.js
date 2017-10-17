// Import Object
var importedItems = galleryItems;

// Build filters out of taxonomy data found in items.js
var itemFilters = buildTermList();
var itemCategories = buildCategoryList();

// Structured based on the importedItems data structure
function buildTermList(){
  
  var uniqueTerms,
      terms;

  terms = importedItems.map( function( item ){

    return item.type;

  });

  // Flatten an "array of arrays" into an array of values
  terms = [].concat.apply([], terms);

  return uniqueTerms = terms.filter( function( term, index ){

    return terms.indexOf( term ) === index;

  })

}

// Structured based on the importedItems data structure
function buildCategoryList(){

  var uniqueTerms,
      terms;
  
  terms = importedItems.map( function( item ){
    
    return item.categories;

  });

  // Flatten an "array of arrays" into an array of values
  terms = [].concat.apply([], terms);

  return uniqueTerms = terms.filter( function( term, index ){

    return terms.indexOf( term ) === index;

  })

}

var justifiedLayout = require( 'justified-layout' );

// Adds the loaded class to img parents
Vue.directive( 'fadeit', {
  inserted ( el ) {
    el.onload = function () {
      if ( el.parentElement ) {
        el.parentElement.classList.add('loaded')
      }
    }
  }
});

var app = new Vue({

  el: "#app3",

  data: {
    master: importedItems,
    items: [],
    container: {
      height: '',
      width: ''
    },
    geometry: {},
    itemAttributes: [],
    config: {
      containerWidth: '',
      targetRowHeight: '220',
      targetRowHeightTolerance: '.35'
    },
    filterImages: true,
    filterVideos: true,
    activeFilters: 'All',
    filterTypes: itemFilters,
    filterCategories: itemCategories,
    initialQuantity: 8
  },

  mounted() {

    this.$nextTick(function() {

      window.addEventListener( 'resize', this.getWindowWidth );

      this.setInitialItems();

      //Init
      this.getWindowWidth();
    })

  },

  computed: {
    filteredItems: function(){

      var updatedItems;

      if( this.filterImages === true && this.filterVideos === true ){

        updatedItems = this.items;

      } else if ( this.filterImages !== true && this.filterVideos !== true ){

        this.filterImages = true;
        this.filterVideos = true;
    
        updatedItems = this.items;

      } else if( this.filterImages === true && this.filterVideos !== true ){

        var filtered = this.items.filter( function( item ){
          return item.type[0] === 'image';
        });
        
        updatedItems = filtered;

      } else if( this.filterImages !== true && this.filterVideos === true ){

        var filtered = this.items.filter( function( item ){
          return item.type[0] === 'video';
        });

        updatedItems = filtered;
        
      }
      
      if( this.activeFilters !== 'All' ){

        var _this = this;

        var filtered = this.items.filter( function( item ){

          var terms = item.categories.filter( function( term ){
            console.log( term, _this.activeFilters );
            return term === _this.activeFilters;

          });

          return terms;

        });

        console.log( 'filter fired' );

      }

      this.$nextTick(function() {
        this.getWindowWidth();
      });

      return updatedItems;

    }
  },

  methods: {

    setInitialItems: function(){

      for( var i = 0; i < this.initialQuantity; i++ ){

        this.items.push( this.master[i] );

      }

    },

    getWindowWidth() {

      // This function handles detecting dimensions on resize, mapping attributes, updating the config object, setting container height, and more. It should be broken into some simpler functions


      // Get the container holding the grid
      var container = document.getElementById('grid');

      // Set the container object width to the current container el width
      this.container.width = container.clientWidth;

      // Set the config object
      this.config.containerWidth = this.container.width;

      // Setup the ItemAttributes object to be sent to the Justified Layout function
      this.itemAttributes = this.filteredItems.map( function(item){

        return { 
          'width' : item.width,
          'height' : item.height
        }

      });

      // Holds the box geometry and container height
      this.geometry = this.getLayout();

      // Set the container height
      this.container.height = this.geometry.containerHeight;

      // Map geometry.boxes to the active items
      this.setDimensions();

    },

    getLayout: function(){

      return require('justified-layout')( this.itemAttributes, this.config );

    },

    setDimensions: function(){

      var _this = this;

      this.geometry.boxes.forEach(function(el, index) {

        _this.filteredItems[index].style.width = el.width;
        _this.filteredItems[index].style.height = el.height;
        _this.filteredItems[index].style.top = el.top;
        _this.filteredItems[index].style.left = el.left;

      });

    },
    
    currentStyle: function(el){

      return { 
        'width': el.style.width + 'px', 
        'height': el.style.height + 'px',
        'top': el.style.top + 'px',
        'left': el.style.left + 'px'
      };

    },

    loadMore: function(){
      
      // Adjust the amount loaded in the initialQuantity variable
      for( var currentLength = this.items.length, i = currentLength; i < currentLength + this.initialQuantity; i++ ){
        if( i < this.master.length ){
          this.items.push( this.master[i] );
        }
      }

      this.getWindowWidth();

    }


  },

  beforeDestroy() {

    window.removeEventListener('resize', this.getWindowWidth);

  }

});