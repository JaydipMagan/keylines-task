# keylines-task
Simple visualiation of Victor Hugo's novel Les Miserables to highlight the most important characters.


## Features

* Change between two layouts
    * Most popular - The node with the most edges will be the largest.
    * Heirarchy - Changes the position of the nodes in the chart to show popularity in ascending order from top to bottom. 
* Change which metric to use to measure popularity
    * total degree - consider all the incoming and outgoing edges of the node 
    * indegree - only consider the outgoing edges of the node
    * outdegree - only consider all the incoming edges of the node
* Highlight nodes connected to a node when clicked
    * All neighbouring nodes are highlighted when node is clicked on


## Important 

Please place the keylines.js file inside the `js` directory.