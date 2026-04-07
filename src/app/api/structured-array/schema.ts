import { z } from "zod";

export const pokemonSchema = z.object({
    name: z.string(),
    abilitites: z.array(z.string()),
    image: z.string(),

})

export const pokemonUiSchema = z.array(pokemonSchema);
