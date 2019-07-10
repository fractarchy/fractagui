# Orbiteque blueprints

Orbiteque is meant to be a visual editor and expression evaluator for Logos. Because Logos represents a formal language for manipulating knowledge, Orbiteque in effect could be used as a spreadsheet, logic database, or general knowledge base manager. Ultimate goal of Logos is to be used by scientists to help them in their researches. The whole science is wrapped around the notion of knowledge, and Logos handles exactly that notion, knowledge. We will try to offer a usable material to a broader group of spreadsheets and database users in a hope to reach the scientists as much smaller group of people. As science in its essence can be used to do wonderful things, we hope that Orbiteque in its final version could make a positive footprint in the civilization.

Programming Orbiteque can be divided into several phases, and each phase individually could have a usability value on a certain range of users of the final version.

# Phase 1 - creating visual interface

In a phase 1 the plan is to offer a kind of logic database navigator and editor where data is spanned over s-expressions, possibly using logical operators to provide a meaningful structure that can be manipulated for sorting and grouping data. Navigator is planed to be implemented as a fractal of ovals that orbit one around others, where each oval is representing an abstract syntax tree node equivalent of navigated s-expression representing data.

There are three segments of this phase that need attention:

## 1. animated fractal

This part is mostly done. There are things like restricted number of nodes that need to be finished, but I'm onto this.

## 2. magnifier lens

Let's see how these s-expressions would span over the fractal. Each s-expresion is built out of other s-expressions or out of constants. S-expressions are about representing lists, while lists of lists represent trees. Suppose we have the following s-expressions:

((2 / 3) + 4) * 5 / (6 - 7)

This expressions would span in fractal ovals in a following way:

- `((2 / 3) + 4) * 5 / (6 - 7)`
    - `(2 / 3) + 4`
        - `2 / 3`
            - `2`
            - `/`
            - `3`
        - `+`
        - `4`
    - `*`
    - `5`
    - `/`
    - `6 - 7`
        - `6`
        - `-`
        - `7`

Each tree node represents a content of one fractal oval. As we can see, parent nodes hold up the entire content of all child nodes to partially compensate ivisibility of text in child nodes due to a magnification decay. That means that ovals could contain a large amounts of formatted s-expressions. In spite of that, there would be no scroll bars. Instead, each oval would integrate something like magnifier lens with a variable magnification depending on distance of the center of the oval. For example, until the radius of a half of an oval the magnification would be 1 times, everything between half and full radius would be magnified by the following formula: `m = 1 - (r / 2) / (r - r / 2)`, while the magnification on the full radius would be 0. This way, an oval could render an infinite pane of text, making the outer regions smaller and smaller. To set the outer regions to a magnification of 1, It would be possible to drag them towards the center of ovals.

## 3. inline editor of s-expressions

The topmost visible oval would have a pushbutton that would ignite an inline editor that would render its output directly into the top oval, through magnifier lens. Nothing fancy, jus a unicode text renderer, keyboard cursor movement, mouse cursor movement, and clipboard operations.

## 4. basic logic database functionality

This is a simple part. Databases are expressed by `implies`, `and` and `or` operators. They would reflect [this phylosophy](https://docs.google.com/presentation/d/1nw7UiYpjvbZv1hOuGiWjxklVKXA3zrGc168XQQ1Mwi0/edit?usp=sharing). This is on example of such database:

    feeding -> (
        (
            (
                strategy -> (
                    scavenging
                )
            ) /\ (
                precondition -> (
                    pray already dead
                )
            )
        ) \/ (
            (
                strategy -> (
                    browsing
                )
            ) /\ (
                precondition -> (
                    pray still alive -> (
                        effect -> (
                            pray stays alive
                        )
                    )
                )
            )
        ) \/ (
            (
                strategy -> (
                    parasitism
                )
            ) /\ (
                precondition -> (
                    pray still alive -> (
                        effect -> (
                            pray stays alive
                        )
                    )
                )
            )
        ) \/ (
            (
                strategy -> (
                    grazing
                )
            ) /\ (
                precondition -> (
                    pray still alive -> (
                        effect -> (
                            pray dies
                        )
                    )
                )
            )
        ) \/ (
            (
                strategy -> (
                    predation
                )
            ) /\ (
                precondition -> (
                    pray still alive -> (
                        effect -> (
                            pray dies
                        )
                    )
                )
            )
        ) \/ (
            (
                strategy -> (
                    parasitoidism
                )
            ) /\ (
                precondition -> (
                    pray still alive -> (
                        effect -> (
                            pray dies
                        )
                    )
                )
            )
        )
    )

Table records are connected by `\/` operator (or). Record fields are connected by `/\` operator (and). `->` operator is not exactly a logic operator because it preserves order in a sequence of implications it is a part of. It would be possible to sort records, and to group records by a same content of some field featuring something like factorization in math. This table would be spanned over fractal ovals just like a plain s-expression. Example of a record:

- `car -> ((color -> white) /\ (type -> electric))`
    - `car`
    - `->`
    - `((color -> white) /\ (type -> electric))`
        - `color -> white`
            - `color`
            - `->`
            - `white`
        - `/\`
        - `type -> electric`
            - `type`
            - `->`
            - `electric`

Sets of records (tables) would be represented in a similar manner. In this phase, no logic inference funtionality except browsing expressions would be implemented.

# Phase 2 - implementing knowledge base logic and evaluator

This phase includes finishing the Logos parser and evaluator and integrating it into Orbiteque. Evaluator is described as follows: suppose we have enter a s-expression `2 + 3 * 4` into Orbiteque edtor session. Upon saving the session, this expression would be evaluated to `14` and shown instead of edited text. Of course, the evaluated result would retain its position inside a hosting s-expression. Then again, if we want to edit this expression `14`, the editor would show the original `2 + 3 * 4` expression to change it as we want.

This would turn Orbiteque into a spreadsheet, but it would be more than that. In Logos, it is possible to do a lot of stuff, including describing [relational algebra](https://en.wikipedia.org/wiki/Relational_algebra) used in database science, which means that Orbiteque could become a full blown relational database. Other uses like content translation, theorem proving, or math equation solving are also possible, and some of them would need to reveal a history of gradual transformations during the evaluation.

# The following phases

The following phases would include SVG renderers and things we would think of in the process of reaching here. Things like building a scientific content sharing site where people could read about and solve math, physics, or chemistry problems, or porting Orbiteque and Logos to [Tiny Core Linux](https://en.wikipedia.org/wiki/Tiny_Core_Linux) to use Orbiteque as a window manager and Logos as a compiler are just some of possible ideas. Anything can happen from this point onwards.
