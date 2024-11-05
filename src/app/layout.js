// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="block-detail" options={{ title: 'Detalhes do Bloco' }} />
        </Stack>
    );
}
