# Clinical Conversation Review

## Run Instructions

From the project directory run the following commands:

```
npm install
npm run dev
```

or visit the [Netlify Deployment](https://clinical-conversation-review.netlify.app) for a live preview

## Approach

To create a realistic call transcription I took a real phone recording from a [linguistic data set](https://catalog.ldc.upenn.edu/LDC97S42) and ran this though an [AI transcription service](https://otter.ai/home). I exported the transcription and wrote a parser to convert it to JSON and added some data for the red flags.

I identified that the clinical user needs to be able to quickly have access to some key context around the recording and the patient in order to support clinical decision making. For example, how long has it been since the surgery took place? This will have an impact on decision making if certain symptoms are persisting longer than expected.

Also, the clinician can see a summary of all the red flags in order to prioritise the most concerning for investigation first. They can then access the full context in the transcript.

I do not expect the transcription to be 100% accurate; poor phone signal, colloquial terms, technical terms, background noise etc. will have an impact on the quality of the transcription. For this reason, I wanted the clinician to be able to listen back and jump to different points in the conversation to get more context in the case of an ambiguous or confusing transcription.

Distractions can occur often for clinicians who are expected to multi-task, I wanted to have a way for the clinician to keep track of their progress. Clinicians can quickly dismiss false positives or record that action has been taken by dismissing a red flag.

## Improvements

## Risk score and categorisation

- There could be many red flags in a long conversation which could be overwhelming. We want a way to highlight the flags which have been given a higher risk score to show these first. We could also look at grouping the risks into categories to provide a summary of the type of risk and allow the viewing of related information together.

## No response could be as important as negative response

- Can we highlight responses which seem out of place, that are no answers to the questions or where no response has been provided

## UX

GP's monitor could be older equipment - need to make sure we're making the best use of vertical space

Customisation - I choose these colors to avoid the most common kind of color blindness and to avoid positive or negative color associations but it would be great if you could easily change font and colors.
