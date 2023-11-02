<script>
    function addMet(record, group) {
        group.forEach(name1 => {
            group.forEach(name2 => {
                if (name1 != name2) {
                    record[name1] = record[name1] || [];
                    record[name1].push(name2);
                }
            });
        });
    }

    export default {
        name: "App",

        data() {
            return {
                newName: "",
                people: [
                    // "Johanna Ramos",
                    // "Bentley Doyle",
                    // "Marin Rivera",
                    // "Jaslene Andrews",
                    // "Kamila Guzman",
                    // "Willow Morrow",
                    // "Macy Beasley",
                    // "Taylor Forbes",
                    // "Jordin Marsh",
                    // "Rylee Knapp",
                    // "Elaine Cervantes",
                    // "David Cooke",
                    // "Megan White",
                    // "Frederick Winters",
                    // "Marely Neal",
                    // "Todd Allen",
                    // "Madden Hines",
                    // "Yandel Blackwell",
                    // "Jared Huber",
                    // "Blaze Hubbard",
                    // "Richard Craig",
                    //"Skyla Jefferson",
                    // "Cole Escobar",
                    // "Ximena Copeland",
                ],
                idealGroupSize: 4,
                rounds: [],
                currentRound: -1,

                groupNames: "ABCDEFGHIJKLMNOPQRSTUVXYZ",

                prevConfig: localStorage.getItem("shuffler-state"),
            };
        },

        computed: {
            current: state => state.rounds[state.currentRound],
            currentRepeats: state => (state.current ? state.current.repeatCounts : 0),
            willMeetTimes() {
                // runs through rounds and count how many times each person will meet the other person
                let met = {};

                this.rounds.forEach(round => {
                    round.groups.forEach(group => {
                        addMet(met, group);
                    });
                });

                Object.entries(met).forEach(([name, people]) => {
                    let totals = {};
                    people.forEach(name2 => {
                        totals[name2] = (totals[name2] || 0) + 1;
                    });

                    let totalRepeats = Object.entries(totals).filter(rec => rec[1] > 1);

                    if (totalRepeats.length) {
                        met[name] = Object.fromEntries(totalRepeats);
                    } else {
                        delete met[name];
                    }
                });

                return Object.entries(met);
            },

            byPerson() {
                let res = {};

                this.rounds.forEach(round => {
                    round.groups.forEach(group => {
                        group.forEach(name => {
                            res[name] = [...(res[name] || []), group.name];
                        });
                    });
                });
                res = Object.entries(res);
                res.sort((a, b) => (a[0] < b[0] ? -1 : 1));

                return res;
            },

            configJSON: state =>
                JSON.stringify({
                    people: state.people,
                    rounds: state.rounds,
                    currentRound: state.currentRound,
                }),
        },

        watch: {
            configJSON(val) {
                localStorage.setItem("shuffler-state", val);
            },
        },

        methods: {
            shuffleRound() {
                // obviously i don't know math or i'd apply some basic-ass rotation and would be done with it
                // figure out the exact sizing of groups
                console.log("Fresh shuffle!");

                let metAll = {}; // the overall record so far of who has met whom
                for (let i = 0; i < this.currentRound; i++) {
                    // establish who has met prevoiusly
                    let groups = this.rounds[i].groups;
                    for (let group of groups) {
                        addMet(metAll, group);
                    }
                }

                let groupCount = Math.ceil(this.people.length / this.idealGroupSize);
                let groupSizeFraction = this.people.length / groupCount;
                let groupSizes = [];
                for (let i = 0; i < groupCount; i++) {
                    let groupSize = Math.round(groupSizeFraction * i) - Math.round(groupSizeFraction * (i - 1));
                    groupSizes.push(groupSize);
                }

                let oneShuffle = () => {
                    // who has already spoken to whom and how many times
                    let met = JSON.parse(JSON.stringify(metAll));

                    function getLeastMet(group, remaining) {
                        let byMet = {};

                        remaining.forEach(name => {
                            let total = (met[name] || []).filter(name2 => group.includes(name2)).length;
                            byMet[total] = [...(byMet[total] || []), name];
                        });

                        return Object.entries(byMet).sort((a, b) => a[0] - b[0])[0][1];
                    }

                    let groups = [];

                    let remaining = [...this.people];

                    groupSizes.forEach((groupSize, idx) => {
                        let group = [];

                        // first we get a seed person for this group
                        let personIdx = Math.random() * remaining.length;
                        let name = remaining.splice(personIdx, 1)[0];
                        group.push(name);

                        // then we put in people they have met the least
                        while (group.length < groupSize) {
                            let leastMet = getLeastMet(group, remaining);
                            let name = leastMet[Math.trunc(Math.random() * leastMet.length)];
                            remaining.splice(remaining.indexOf(name), 1)[0];
                            group.push(name);
                        }

                        addMet(met, group);

                        groups.push(group);
                    });

                    // now count the total repeat meets
                    let totals = {};
                    for (let name of this.people) {
                        for (let name2 of met[name]) {
                            if (!totals[`${name2},${name}`]) {
                                totals[`${name},${name2}`] = (totals[`${name},${name2}`] || 0) + 1;
                            }
                        }
                    }
                    let repeats = Object.entries(totals)
                        .filter(rec => rec[1] > 1)
                        .map(([names, meets]) => [names, meets - 1]);
                    let repeatCounts = repeats.reduce((acc, cur) => acc + cur[1], 0);

                    return {groups, repeats, repeatCounts};
                };

                let results = [];
                for (let iterations = 0; iterations < 2000; iterations++) {
                    let shuffle = oneShuffle();
                    results.push(shuffle);
                    if (shuffle.repeats == 0) {
                        // we have a winner
                        console.log("Found zero repeats on iteration", iterations);
                        break;
                    }
                }
                results.sort((a, b) => a.repeatCounts - b.repeatCounts);
                let round = results[0];

                if (round.repeatCounts) {
                    console.log("repeats:", round.repeats);
                }

                // on reshuffle we remove the previous future rounds as that makes
                // no sense anymore
                this.resetFuture();
                this.rounds[this.currentRound] = round;
            },

            nextRound() {
                this.currentRound += 1;
                if (!this.rounds[this.currentRound]) {
                    this.shuffleRound();
                }
            },

            addName() {
                let name = this.newName.trim();
                if (!name || this.people.map(n => n.toLowerCase()).includes(name.toLowerCase())) {
                    // no dupes
                    return;
                }
                this.people.push(name);
                this.newName = "";
                let box = this.$refs.inputBox.getBoundingClientRect();
                window.scrollTo(0, window.scrollY + box.top);

                // add the new person to the smallest group
                let round = this.rounds[this.currentRound] || {};
                let groupSizes = (round.groups || []).map(g => ({group: g, size: g.length}));
                if (groupSizes.length) {
                    groupSizes.sort((a, b) => a.size - b.size);
                    groupSizes[0].group.push(name);
                }
                this.resetFuture();
            },

            onInputKey(evt) {
                if (evt.key == "Enter") {
                    this.addName();
                }
            },

            removeName(name) {
                // remove the person from the global list as well as from the current round
                let idx = this.people.indexOf(name);
                this.people.splice(idx, 1);
                let currentRound = this.rounds[this.currentRound];
                if (currentRound) {
                    currentRound.groups.forEach((group, idx) => {
                        currentRound.groups[idx] = group.filter(n => n != name);
                    });
                }
                this.resetFuture();
            },

            loadPrevSession() {
                let config = JSON.parse(this.prevConfig);
                Object.entries(config).forEach(([key, val]) => {
                    this[key] = val;
                });
            },

            resetFuture() {
                this.rounds = this.rounds.slice(0, this.currentRound + 1);
            },
        },

        mounted() {
            // this.nextRound();
        },
    };
</script>

<template>
    <div class="app">
        <div class="param-input">
            <header>Rounds and groups</header>
            <section class="rounds-groups">
                <label>Group size:</label>
                <input type="number" v-model="idealGroupSize" @change="shuffle" />
            </section>

            <header>People ({{ people.length }})</header>
            <div class="people">
                <div class="people-row" v-for="name in people" :key="name">
                    <div>{{ name }}</div>
                    <button @click="removeName(name)">x</button>
                </div>
            </div>
            <section class="people-input" ref="inputBox">
                <input type="text" v-model="newName" @keypress="onInputKey" placeholder="Name" />
                <button @click="addName">Add</button>
            </section>

            <!--
            <template v-if="people.length > 2">
                <template v-if="willMeetTimes.length">
                    <h1>Some repeat meets</h1>
                    <div class="dupes">
                        <template v-for="[name, stats] in willMeetTimes" :key="name">
                            <div>{{ name }}</div>
                            <div>{{ stats }}</div>
                        </template>
                    </div>
                </template>
            </template>
            -->
        </div>

        <div class="rounds">
            <div class="start-shuffle" v-if="!people.length && prevConfig">
                <button @click="loadPrevSession()">Load previous session</button>
            </div>

            <div class="start-shuffle" v-else-if="people.length > 2 && !rounds[currentRound]">
                <button @click="nextRound()">Shuffle!</button>
            </div>

            <template v-else-if="people.length > 2">
                <h1>
                    <template v-if="!currentRepeats"> Round {{ currentRound + 1 }} </template>
                    <template v-else> Round {{ currentRound + 1 }}, {{ currentRepeats }} repeats </template>
                </h1>
                <div class="round-controls">
                    <button @click="currentRound -= 1" :disabled="currentRound <= 0">Previous round</button>
                    <button @click="nextRound">Next round</button>
                    <hr />
                    <button @click="shuffleRound">Reshuffle</button>
                </div>

                <!-- <h1>
                    {{ people.length }} people, {{ roundCount }} rounds, {{ willMeetTimes.length }} repeat meets</h1>
                -->

                <div class="round">
                    <div class="groups">
                        <template v-for="(group, idx) in rounds[currentRound].groups" :key="idx">
                            <b>Group {{ groupNames[idx] }}:</b>
                            {{ group.join(", ") }}
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
    .app {
        padding: 1em;
        gap: 2em;
        display: flex;
        font-family: "Droid Sans";
    }

    input {
        padding: 5px;
    }

    button {
        padding: 8px 12px;
        min-width: 2em;
        border: none;
        background: #ccc;
        margin: 1px;
    }

    label {
        padding-right: 0.5em;
    }

    header {
        font-weight: 600;
        padding: 10px 0;
    }

    .app > div {
        flex-grow: 1;
    }

    .people-input {
        display: flex;
        gap: 0.5em;
        input {
            flex-grow: 1;
        }
    }

    input[type="number"] {
        min-width: 2em;
        max-width: 5em;
    }

    .rounds-groups {
        display: flex;
        input {
            width: 100%;
        }
        label {
            white-space: nowrap;
        }
    }

    .param-input {
        margin-bottom: 2em;
        max-width: 18em;
    }

    section {
        margin-bottom: 1em;
        display: flex;
        gap: 0.5em;
        align-items: center;
    }

    .groups {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.5em;
        gap: 1em;
        line-height: 150%;
    }

    .dupes {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 5px;
    }

    .by-person {
        display: grid;
        gap: 0.5em;
    }

    .people {
        display: grid;

        .people-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 0.5em;
            padding: 8px;
            padding-left: 15px;
            align-items: center;
            border-bottom: 1px solid #ddd;

            &:hover {
                background: #eee;
            }
        }

        button {
            border: none;
            background: none;
            cursor: pointer;

            &:hover {
                color: red;
            }
        }
    }

    .start-shuffle {
        display: flex;
        justify-content: center;
    }

    .start-shuffle > button {
        font-size: 2em;
        padding: 12px 20px;
    }

    .round-controls {
        display: flex;
        gap: 0.5em;
        margin-bottom: 1em;

        hr {
            border: none;
            flex-grow: 1;
        }
    }

    @media (max-width: 600px) {
        .app {
            flex-wrap: wrap;

            .param-input {
                max-width: unset;
            }
        }
    }
</style>
