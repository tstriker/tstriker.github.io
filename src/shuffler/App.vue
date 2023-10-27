<script>
    export default {
        name: "App",

        data() {
            return {
                newName: "",
                people: [
                    "Johanna Ramos",
                    "Bentley Doyle",
                    "Marin Rivera",
                    "Jaslene Andrews",
                    "Kamila Guzman",
                    "Willow Morrow",
                    "Macy Beasley",
                    "Taylor Forbes",
                    "Jordin Marsh",
                    "Rylee Knapp",
                    "Elaine Cervantes",
                    "David Cooke",
                    "Megan White",
                    "Frederick Winters",
                    "Marely Neal",
                    "Todd Allen",
                    "Madden Hines",
                    "Yandel Blackwell",
                    // "Jared Huber",
                    // "Blaze Hubbard",
                    // "Richard Craig",
                    // "Skyla Jefferson",
                    // "Cole Escobar",
                    // "Ximena Copeland",
                ],
                idealGroupSize: 4,
                roundCount: 3,
                rounds: [],
            };
        },

        computed: {
            willMeetTimes() {
                // runs through rounds and count how many times each person will meet the other person
                let met = {};

                this.rounds.forEach(round => {
                    round.groups.forEach(group => {
                        group.people.forEach(name1 => {
                            group.people.forEach(name2 => {
                                if (name1 != name2) {
                                    met[name1] = [...(met[name1] || []), name2];
                                }
                            });
                        });
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
                        group.people.forEach(name => {
                            res[name] = [...(res[name] || []), group.name];
                        });
                    });
                });
                res = Object.entries(res);
                res.sort((a, b) => (a[0] < b[0] ? -1 : 1));

                return res;
            },
        },

        methods: {
            addName() {
                this.people.push(this.newName);
                this.newName = "";
                this.shuffle();
            },

            onInputKey(evt) {
                if (evt.key == "Enter") {
                    this.addName();
                }
            },

            shuffle() {
                // obviously i don't know math or i'd apply some basic-ass rotation and would be done with it

                // figure out the exact sizing of groups
                let groupCount = Math.ceil(this.people.length / this.idealGroupSize);
                let groupSizeFraction = this.people.length / groupCount;
                let groupSizes = [];
                for (let i = 0; i < groupCount; i++) {
                    let groupSize = Math.round(groupSizeFraction * i) - Math.round(groupSizeFraction * (i - 1));
                    groupSizes.push(groupSize);
                }

                let oneShuffle = () => {
                    let rounds = [];
                    let met = {}; // who has already spoken to whom and how many times

                    function getLeastMet(group, remaining) {
                        let byMet = {};

                        remaining.forEach(name => {
                            let total = (met[name] || []).filter(name2 => group.includes(name2)).length;
                            byMet[total] = [...(byMet[total] || []), name];
                        });

                        return Object.entries(byMet).sort((a, b) => a[0] - b[0])[0][1];
                    }

                    let groupNames = "ABCDEFGHIJKLMNOPQRSTUVXYZ";

                    for (let i = 0; i < this.roundCount; i++) {
                        let round = {name: `Round ${i + 1}`, groups: []};

                        let remaining = [...this.people];

                        groupSizes.forEach((groupSize, idx) => {
                            let group = {name: groupNames[idx], size: groupSize, people: []};

                            // first we get a seed person for this group
                            let personIdx = Math.random() * remaining.length;
                            let name = remaining.splice(personIdx, 1)[0];
                            group.people.push(name);

                            // then we put in people they have met the least
                            while (group.people.length < groupSize) {
                                let leastMet = getLeastMet(group.people, remaining);
                                let name = leastMet[Math.trunc(Math.random() * leastMet.length)];
                                remaining.splice(remaining.indexOf(name), 1)[0];
                                group.people.push(name);
                            }

                            group.people.forEach(name1 => {
                                group.people.forEach(name2 => {
                                    if (name1 != name2) {
                                        met[name1] = [...(met[name1] || []), name2];
                                    }
                                });
                            });

                            round.groups.push(group);
                        });

                        rounds.push(round);
                    }
                    return rounds;
                };

                let calcMeets = rounds => {
                    // runs through rounds and count how many times each person will meet the other person
                    let met = {};
                    rounds.forEach(round => {
                        round.groups.forEach(group => {
                            group.people.forEach(name1 => {
                                group.people.forEach(name2 => {
                                    if (name1 != name2) {
                                        met[name1] = [...(met[name1] || []), name2];
                                    }
                                });
                            });
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

                    let totalRepeats = Object.values(met)
                        .map(rec => Object.values(rec))
                        .flat()
                        .reduce((prev, cur) => prev + cur, 0);
                    return totalRepeats;
                };

                let results = [];
                for (let i = 0; i < 1000; i++) {
                    let rounds = oneShuffle();
                    let met = calcMeets(rounds);
                    results.push({met, rounds});
                    if (met == 0) {
                        // we have a winner
                        break;
                    }
                }
                results.sort((a, b) => a.met - b.met);

                this.rounds = results[0].rounds;
            },
        },

        mounted() {
            this.shuffle();
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

                <label>Rounds:</label>
                <input type="number" v-model="roundCount" @change="shuffle" />
            </section>

            <header>People</header>
            <section class="people-input">
                <input type="text" v-model="newName" @keypress="onInputKey" placeholder="Name" />
                <button @click="addName">Add</button>
                <button @click="shuffle">Shuffle</button>
            </section>

            <div class="people">
                <div v-for="(name, idx) in people" :key="idx">
                    {{ name }}
                    <button
                        @click="
                            people.splice(idx, 1);
                            shuffle();
                        "
                    >
                        x
                    </button>
                </div>
            </div>

            <template v-if="people.length > 2">
                <!-- <template v-if="willMeetTimes.length">
                    <h1>Some repeat meets</h1>
                    <div class="dupes">
                        <template v-for="[name, stats] in willMeetTimes" :key="name">
                            <div>{{ name }}</div>
                            <div>{{ stats }}</div>
                        </template>
                    </div>
                </template> -->
            </template>
        </div>

        <div class="rounds" v-if="people.length > 2">
            <h1>{{ people.length }} people, {{ roundCount }} rounds, {{ willMeetTimes.length }} repeat meets</h1>

            <div class="round" v-for="round in rounds" :key="round.name">
                <h2>{{ round.name }}</h2>
                <div class="groups">
                    <template v-for="group in round.groups" :key="group.name">
                        <b>{{ group.name }}:</b>
                        {{ group.people.join(", ") }}
                    </template>
                </div>
            </div>

            <h1 style="margin-top: 2em">By person</h1>
            <div class="by-person">
                <div v-for="[name, rounds] in byPerson" :key="name">
                    <b>{{ name }}:</b> {{ rounds.join(", ") }}
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .app {
        padding: 1em;
        display: flex;
        flex-wrap: wrap;
        font-family: "Droid Sans";
    }

    .app > div {
        flex-grow: 1;
    }

    .people-input {
        display: flex;
        gap: 0.5em;
    }

    .param-input {
        margin-bottom: 2em;
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
    }

    .dupes {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 5px;
    }

    input {
        padding: 5px;
    }

    input[type="number"] {
        width: 3em;
    }

    button {
        padding: 5px;
        min-width: 2em;
    }

    label {
        padding-right: 0.5em;
    }

    header {
        font-weight: 600;
        padding: 10px 0;
    }

    .by-person {
        display: grid;
        gap: 0.5em;
    }

    .people {
        display: grid;
        gap: 0.5em;
    }
</style>
