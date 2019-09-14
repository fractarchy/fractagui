# Orbiteque

## content
- [about the project](about-the-project)  
- [first release](first-release)  
- [further releases](further-releases)  
- [current status](current-status)  

## about the project

Hello all. I'm a software researcher and developer. In my job I get wonderful ideas for constructing software. However, I recently ran out of my resources, and I'm seeking for another way to finance my researches. To do this, I picked up some of my exciting ideas and decided to make a piece of useful business software out of it. Hence, I started to program *Orbiteque* *personal knowledge base*. If you are interested in the current status of the programming progress, you can visit a [live *Orbiteque* demo](https://e-teoria.github.io/Orbiteque/).

To describe the project, first, let's see what Wikipedia says about [personal knowledge bases](https://en.wikipedia.org/wiki/Personal_knowledge_base):
> A personal knowledge base (PKB) is an electronic tool used to express, capture, and later retrieve the personal knowledge of an individual. It differs from a traditional database in that it contains subjective material particular to the owner, that others may not agree with nor care about. Importantly, a PKB consists primarily of knowledge, rather than information; in other words, it is not a collection of documents or other sources an individual has encountered, but rather an expression of the distilled knowledge the owner has extracted from those sources.

## first release

In the first release version, *Orbiteque* will be a tree branching personal knowledge base that could be used as a medium for storing data about personal, scholar, or business notes, web links, cooking recipes, data about home videoteque, programming language snippets, drawings, photos... In short, *Orbiteque* could be used to keep notes about, catalogize and structurize knowledge related to any kinds of materia, as long as that materia can be described by text and images. The structure of materia is visualized in a very special way in *Orbiteque*, resembling a form of a fractal in which child ovals orbit around a parent oval recursively. Ovals would store textual and image information that fit into parent-children tree structure. These ovals could be dragged around their parents to walk horizontally through the tree. Also, ovals could be dragged in or out to their parents or children places to walk vertically through the tree of data. The first release version would represent a fully functional personal knowledge base system with template documenting abilities.

One of philosophies which guide the development of *Orbiteque* is that users should not depend on cloud services for keeping personal data. Thus, personal data would be stored far from cloud, on local machine. Also, to align with this philosophy, data editor and navigation part of *Orbiteque* would be in a form of a downloadable serverless DHTML application, so that users do not depend on web services to edit or navigate their personal data.

## further releases

In further release versions we may expect formal knowledge assistance tools like general data computing environment and automated theorem prover, all corroborated with template documenting abilities inherited from the first release version. And in the final release version, *Orbiteque* would also provide an interface to connect to a dedicated server for sharing knowledge, which could be useful for exchanging prose texts, as well as exchanging formal knowledge described by a [metatheory formal language](https://github.com/e-teoria/Logos) being specifically developed for this purpose. The server software would be available for public use, so that anyone could setup their own knowledge sharing web site on custom www address. The knowledge sharing phase would shift *Orbiteque* from personal knowledge base domain to an optional knowledge base sharing domain. As supposed, users would be completely in charge of what to share, where to share it, and when to share it to the public, if they want to share their materials at all.

Personally, I put a lot of hopes in mentioned metatheory formal language as an inspiration to formalize and connect pieces of knowledge gathered among different scientific fields, with possibility of automated data mining and deriving knowledge implicitly contained within uploaded information. In my humble opinion, knowledge has a power to change the world in a positive sense, and sharing knowledge should have a special place in our activities. Thus, my plan is to try to contribute to knowledge gathering and sharing technology.

## current status

There are several checkpoints in developing *Orbiteque*:

1. [x] Animated visual interface composed of ovals that orbit around each other, forming an interactive data fractal
2. [ ] Turing complete content template language implementation and integration
3. [ ] Text editor nested inside ovals for modifying the content sited on local machine
4. [ ] Metatheory formal language implementation and integration
5. [ ] Mothersite web application and interface to it for exchanging gathered knowledge with public

The current status of implementation is that the first item of the list is already functional. I predict the second and third list items to be fully functional within a period of less then a year. The fourth and fifth list items are predicted to be finished within another two years, if the first three items (minimum viable product) would be shown to attract enough potential users. Also, if enough users apply to the final release, the whole system may advance to be updated by new ideas and extensions that users may find useful.

I have a personal interest in finishing this project because it is consisted of my nearly lifetime efforts in computing research field, and I'm determined to make myself useful to the public. Without potential users, all of my work means nothing to me.

Wish me luck :)
