// Quick hacky script to parse an otter transcription to a json format I can use
import fs from "fs"

const file = fs.readFileSync(".src/data/transcription.txt", "utf-8")

const lines = file.split("\n")

const conversation: {
    speaker: string;
    timestampSeconds: number;
    utterance: string;
}[] = []

let speaker: null | string = null;
let timestamp: null | number = null;


lines.map((line: string, i: number) => {
    if(i % 3 === 0) {
        const speakerAndTimestamp = line.split(/\s+/);
        speaker = speakerAndTimestamp[0]
        const minutesAndSeconds = speakerAndTimestamp[1].split(":")
        timestamp = Number((minutesAndSeconds[0])) * 60 + Number(minutesAndSeconds[1]);
    }

    if(i % 3 === 1) {
        conversation.push({
            speaker: speaker as string,
            timestampSeconds: timestamp  as number,
            utterance: line
        })
    }
})

fs.writeFileSync("conversation.json", JSON.stringify(conversation));