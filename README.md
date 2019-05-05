# STGraphJS

An experimental version of <a href="http://per.liuc.it/luca.mari/stgraph" target="_blank">STGraph</a>

(<a href="https://lmari.github.io/STGraphJS/q.html" target="_blank">run the demo</a>)

STGraph is a software application to interactively run models of dynamical systems
according to the state variable approach of System Theory.

With respect to the original Java version, this experimental version:
* is written in Javascript, as a client-side application that runs on any sufficiently new browser;
* completely decouples the execution engine and the browser-based front-end (via callbacks);
* handles scalar and vector variables, but not higher order arrays (i.e., matrices and tensors);
* analogously handles infix operators in a polymorphic way (e.g., it computes a+b where a and b may be
both scalars, or one is scalar and one is vector, or both are vectors);
* handles functions written in the JS syntax instead of STEL (including reduce() instead of APL-like / reduction);
* does not provide a graph-based editor to create and modify models;
* does not handle sub-models;
* has a smaller number of widgets;
* has a smaller number of functions.
