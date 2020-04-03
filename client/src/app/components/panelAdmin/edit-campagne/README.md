# Template documentation

To create the PDF we decided to use pdfMake.
You can find the documentation here : https://pdfmake.github.io/docs/

TLDR;
The html is written in JSON format.
The definition is made up of 3 main things 
   - content (an array containing object describing paragraphs or tables)
   - styles ( key value pairs each key represent className)
   - tableLayouts (key value paris where key represents className of the table. Difference is that tableLayouts is more powerful)
   
Finally we create a big object definition = {content, styles, tableLayouts} and pass it to pdfmake to create the end result.