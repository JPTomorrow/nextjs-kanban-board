# Kan-Bam (Built with Create T3 App stack)

## ROADMAP:

- (complete) resizable number columns
- named columns
- (complete) cards that support text
- drag and drop functionality for the cards
- cards are owned by the columns (by column name)
- column deletion logic and safeguards
- card drag between columns (card ownership change etc.)
- filter system for the cards
- one master password to the whole shebang because I like to feel alive sometimes. If you want to impliment robust Auth and use this for whatever you want, feel free to fork it and go to town. Message me and I'll slap a decent FOSS liscense on it if I haven't already.

# Development

- PlanetScale is the intended serverless database provider
- Vercel is the intended serverless hosting solution

## launch dev server

```
npm run dev
```

## launch prisma database inspector

```
npx prisma studio
```

## update database schema in schema.prisma

```
npx prisma db push
```
