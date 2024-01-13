module.exports = formatResults;

const pb = {
    leGreen: '<:LEgreen:1193145149014941717>',
    meGreen: '<:MEgreen:1193145157822984324>',
    reGreen: '<:REgreen:1193145166362591282>',
    lfGreen: '<:LFgreen:1193145153519624252>',
    mfGreen: '<:MFgreen:1193145162088583168>',
    rfGreen: '<:RFgreen:1193145170531729469>',
    leRed: '<:LEred:1193145151212748851>',
    meRed: '<:MEred:1193145159240667216>',
    reRed: '<:REred:1193145168145170502>',
    lfRed: '<:LFred:1193145155054731345>',
    mfRed: '<:MFred:1193145163892146207>',
    rfRed: '<:RFred:1193145172670816286>',
};

function calculateColor(upvotePercentage, downvotePercentage) {
    if (upvotePercentage === 0) {
        return 'red'; // All downvotes, set to red
    } else if (downvotePercentage === 0) {
        return 'green'; // All upvotes, set to green
    } else {
        return 'mixed'; // Mixed votes, set to a mix of green and red
    }
}

function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 26; // Set the length to 26

    const upvotePercentage = upvotes.length / totalVotes;
    const downvotePercentage = downvotes.length / totalVotes;

    const color = calculateColor(upvotePercentage, downvotePercentage);

    const halfProgressBarLength = progressBarLength / 2;
    const filledSquaresGreen = Math.min(Math.round(upvotePercentage * halfProgressBarLength), halfProgressBarLength) || 0;
    const filledSquaresRed = Math.min(Math.round(downvotePercentage * halfProgressBarLength), halfProgressBarLength) || 0;

    const upPercentage = upvotePercentage * 100 || 0;
    const downPercentage = downvotePercentage * 100 || 0;

    const progressBar =
        color === 'red'
            ? pb.lfRed + pb.mfRed.repeat(halfProgressBarLength) + pb.rfRed
            : color === 'green'
            ? pb.lfGreen + pb.mfGreen.repeat(halfProgressBarLength) + pb.rfGreen
            : (filledSquaresGreen ? pb.lfGreen : pb.leGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.rfRed : pb.reRed);

    const results = [];
    results.push(
        `:thumbsup: ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • :thumbsdown: ${
            downvotes.length
        } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);

    return results.join('\n');
}

module.exports = formatResults;
