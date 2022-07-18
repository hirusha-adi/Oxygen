// search index for WYSIWYG Web Builder
var database_length = 0;

function SearchPage(url, title, keywords, description)
{
   this.url = url;
   this.title = title;
   this.keywords = keywords;
   this.description = description;
   return this;
}

function SearchDatabase()
{
   database_length = 0;
   this[database_length++] = new SearchPage("index.html", "Untitled Page", "Thumbnail          Name  Lorem ipsum  Integer nec odio  Praesent libero  Duis sagittis ipsum  Quality  1977  1978  1983  1986  Info   8.8  7.4  7.5  8.5  Download  777,100  888,800  425,250  515,500   ", "");
   return this;
}
