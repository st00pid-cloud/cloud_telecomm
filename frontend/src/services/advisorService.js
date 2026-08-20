export async function generateRecommendation(snapshot) {
    const response = await fetch(
        '/api/advisor/recommendation',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(snapshot),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to generate recommendation');
    }

    return response.json();
}