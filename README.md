# Orbiteque

## about the project

Hello all. I'm Ivan Vodišek. I'm a software researcher and developer. In my job I get wonderful ideas for constructing software. However, recently I ran out of my resources, and I'm seeking for another way to finance my researches. To do this, I picked up some of my exciting ideas and decided to make a piece of business software out of it. Hence, I started to program **Orbiteque** *personal knowledge base*. If you are interested in the current status of the programming progress, you can visit a [live demo](https://e-teoria.github.io/Orbiteque/) of *Orbiteque*.

First, let's see what Wikipedia says about personal knowledge bases:
> A personal knowledge base (PKB) is an electronic tool used to express, capture, and later retrieve the personal knowledge of an individual. It differs from a traditional database in that it contains subjective material particular to the owner, that others may not agree with nor care about. Importantly, a PKB consists primarily of knowledge, rather than information; in other words, it is not a collection of documents or other sources an individual has encountered, but rather an expression of the distilled knowledge the owner has extracted from those sources.

In the first release version, *Orbiteque* will be a tree like personal knowledge base that could be used as a medium for storing data about personal, scholar or business notes, web links, cooking recipes, data about home videoteque, programming language snippets, drawings, photos... In short, *Orbiteque* could be used to keep notes about, catalogize and structurize knowledge about any kinds of items, as long as they can be described by text and images. The structure of catalogs is visualized in a very special way, resembling a form of a fractal in which child ovals orbit around a parent oval recursively. Ovals would store textual and image information that fit into parent-children tree structure. These ovals could be dragged around their parents to walk horizontally through the tree, and ovals could be dragged in or out of their parents or children to walk vertically through the tree of data.

Further release versions would include formal knowledge assistance like general data computing environment and automated theorem prover, all corroborated with documenting abilities inherited from the first release version. In the final release version, *Orbiteque* would provide an interface to connect to a dedicated web site for sharing knowledge, which could be useful for exchanging prose texts and computed information described by a [metatheory formal language](https://github.com/e-teoria/Logos) being specifically developed for this purpose. The knowledge sharing phase would shift *Orbit* from personal knowledge base domain to public knowledge base domain, of course, only if a user chooses to share her materials. The whole system would be opened for public use, so that anyone could setup their own knowledge sharing site on custom www address.

One of philosophies which guide the development of *Orbiteque* is that users should not depend on cloud services for keeping personal data. Thus, personal data would be stored not in cloud, but on local machine. Also, to align with this philosophy, data editor part of *Orbiteque* would be in a form of a downloadable serverless DHTML application so that users do not depend on web services to edit or navigate their data. Users would be completely in charge of what to share, where to share and when to share their materials to public, if they want to share it at all.

## current status

There are several checkpoints in developing *Orbiteque*:

1. [x] animated visual interface composed of ovals that orbit around each other forming a fractal
2. [ ] text editor nested inside ovals for modifying the content sited on local machine
3. [ ] metatheory formal language implementation and integration
4. [ ] interface to mothersite web application for exchanging knowledge with public

The current status of implementation is that the first item of the list is functional. I predict the second list item to be fully functional within a period of less then a year. The third and fourth list items are predicted to be finished within another two years, if the first two items would be shown to attract enough potential users. I have a personal interest in finishing this project because it is consisted of my lifetime work in a field of computing science. Also, if enough users apply to the finished version, the software could be updated by new ideas and extensions that potential users may find useful.

Wish me luck :)
