# TEXT - OpenAI service for message transformation

from openai import AsyncOpenAI
from app.config import settings

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model

    def _build_system_prompt(self, angry_at: str, format: str, tone: str, kindness_scale: int, profanity_check: str = "none", message_length: int = 0, voice_format: str = None, voice_personality: str = None) -> str:   
        """Build dynamic system prompt based on user preferences."""
        base_prompt = "You are an expert communication specialist who transforms angry, frustrated, disappointed, and annoyed messages into a message with increased or decreased intensity levels of emotion. This emotion intensity level is set by kindness_scale. \n\n"
        base_prompt += "Important: The intent of the transformation of the message is for both practical and comedic use. The common use is that It allows for the venting of an unfiltered message with varying levels of emotion, and the transformation allows it to be restructured with the intention of sending it a person specified by angry_at. \n"
        base_prompt += "Practical use: The practical use is to foster coherent communication in moments of high intensity emotion fueled by frustration, disappointment, sadness or otherwise. Allows for filtering of messages and thoughts to be communicated without ruining relationships."
        base_prompt += "Comedic use: The comedic use is to be more raw and unfiltered language, possibly even let the sender a have good laugh. The purpose would just be have a fun message generated for sharing."
        base_prompt += "The type of use (whether practical or comedic) should be determined depending on intended person set in angry_at along with the tone and kindness_scale."

        base_prompt += f"\nTransform this message as it is intended for a {angry_at}.\n"

        if angry_at == "friend":
            if kindness_scale <= 2:
                base_prompt += "Keep it casual but appropriate - like talking to an acquaintance or someone you don't know super well. Use normal capitalization.\n"
            elif kindness_scale == 3:
                base_prompt += "Casual and direct - comfortable friend level. Use normal capitalization.\n"
            else:  # 4-5
                base_prompt += "Very casual and raw - close friend who can handle unfiltered honesty. KEEP CAPS from original for emphasis.\n"

        elif angry_at == "family":
            if kindness_scale <= 2:
                base_prompt += "Be respectful and somewhat formal. Maintain family respect even when frustrated. Remove ALL CAPS, use proper capitalization.\n"
            elif kindness_scale == 3:
                base_prompt += "Balance respect with honesty. Moderately casual family tone. Use normal capitalization.\n"
            else:  # 4-5
                base_prompt += "More casual but still respectful - frustrated family member but not crossing lines. Less formal than acquaintance level but not as casual as close friends. Convert CAPS to normal text.\n"

        elif angry_at == "partner":
            if kindness_scale <= 2:
                base_prompt += "Gentle and caring, maintain emotional connection. Express concern with love. Use normal capitalization.\n"
            elif kindness_scale == 3:
                base_prompt += "Direct but caring. Balance honesty with maintaining the relationship. Use normal capitalization.\n"
            else:  # 4-5
                base_prompt += "Frustrated but still emotionally connected. Show disappointment clearly but remember this is someone you care about. More casual than family, but not quite friend-level rawness. Convert most CAPS to normal text.\n"

        elif angry_at == "coworker":
            if kindness_scale <= 2:
                base_prompt += "VERY professional and diplomatic - appropriate for speaking to a boss or superior. Formal workplace language. Remove ALL CAPS completely.\n"
            elif kindness_scale == 3:
                base_prompt += "Professional but direct. Peer-level workplace communication. Use normal capitalization.\n"
            else:  # 4-5
                base_prompt += "Frustrated but HR-safe. Direct and firm workplace boundaries without being unprofessional. Show frustration clearly but keep it workplace appropriate. Convert CAPS to normal text.\n"

        elif angry_at == "stranger":
            base_prompt += "Use formal language with no assumed familiarity. Be direct based on the tone. Remove ALL CAPS.\n"

        base_prompt += f"\nTone requirement: {tone}\n"

        if tone == "professional":
            base_prompt += "Use formal business language. Be diplomatic and constructive.\n"
        elif tone == "intimidating":
            base_prompt += "Use VERY authoritative, commanding, and aggressive language. Be intimidating and forceful. Sound threatening and powerful. Make them feel the weight of your anger.\n"
        elif tone == "sarcastic":
            base_prompt += "Use a sarcastic, mocking tone with subtle jabs and ironic observations. Sound dismissive and witty.\n"
        elif tone == "condescending":
            base_prompt += "Use a patronizing tone that talks down slightly, as if explaining to someone less informed.\n"
        elif tone == "disappointed":
            base_prompt += "Express clear disappointment and unmet expectations.\n"

        base_prompt += f"\nKindness level: {kindness_scale}/5\n"

        if kindness_scale == 1:
            base_prompt += "Be VERY harsh, direct, and intense. Use strong, cutting language. Don't hold back. Make the anger and frustration crystal clear. Be brutal and unfiltered.\n"
        elif kindness_scale == 2:
            base_prompt += "Be direct and firm. Don't sugar-coat. Express frustration clearly and bluntly.\n"
        elif kindness_scale == 3:
            base_prompt += "Be balanced and fair. Be direct but not harsh.\n"
        elif kindness_scale == 4:
            base_prompt += "Be kind, polite, and constructive. Use gentle language and positive framing.\n"
        else:  # kindness_scale == 5
            base_prompt += "Be VERY kind, polite, and constructive. Use very gentle language and extremely positive framing. Maximum kindness.\n"

         # Voice-specific formatting
        if voice_format:
            base_prompt += f"\n\n=== CRITICAL VOICE FORMAT REQUIREMENT ===\n"
            base_prompt += f"FORMAT: {voice_format.upper()}\n"
            base_prompt += f"IMPORTANT: Apply this format WHILE STILL MAINTAINING the angry_at relationship ({angry_at}), tone ({tone}), and kindness level ({kindness_scale}).\n"
            base_prompt += f"The format changes HOW you say it, but the WHO ({angry_at}), EMOTION ({tone}), and INTENSITY (kindness {kindness_scale}) must remain clear.\n\n"
            if voice_format == "rap":
                base_prompt += "YOU MUST WRITE THIS AS A FULL RAP VERSE:\n"
                base_prompt += "- Use AABB or ABAB rhyme scheme (every line MUST rhyme)\n"
                base_prompt += "- Include strong rhythm and flow like a hip-hop artist\n"
                base_prompt += "- Use slang, wordplay, metaphors, and rap terminology\n"
                base_prompt += "- Break into bars/verses (minimum 8 bars)\n"
                base_prompt += "- Make it sound like Eminem, Kendrick Lamar, or a battle rapper\n"
                base_prompt += "- Example style: 'Yo, listen up / I got something to say / Your actions lately / Been going the wrong way'\n"
            elif voice_format == "cursed_spell":
                base_prompt += "YOU MUST WRITE THIS AS AN ANCIENT CURSE/SPELL:\n"
                base_prompt += "- Use OLD ENGLISH/archaic language: thee, thou, thy, thine, hath, doth, shall, shalt\n"
                base_prompt += "- Include mystical/supernatural phrases: 'By the powers of darkness', 'I curse thee', 'May thy'\n"
                base_prompt += "- Be DRAMATIC and OMINOUS with foreboding tone\n"
                base_prompt += "- Sound like a wizard/witch casting a serious hex\n"
                base_prompt += "- Example: 'Hear me now, by ancient rite, I curse thee with eternal blight!'\n"
            elif voice_format == "shakespearean":
                base_prompt += "YOU MUST WRITE IN PURE SHAKESPEAREAN ENGLISH:\n"
                base_prompt += "- MANDATORY: Use thee, thou, thy, thine, hast, hath, doth in every sentence\n"
                base_prompt += "- Write in iambic pentameter style (da-DUM da-DUM da-DUM da-DUM da-DUM)\n"
                base_prompt += "- Be EXTREMELY poetic, dramatic, theatrical, and flowery\n"
                base_prompt += "- Use metaphors and elaborate descriptions\n"
                base_prompt += "- Sound exactly like Romeo & Juliet or Hamlet\n"
                base_prompt += "- Example: 'What light through yonder window breaks? 'Tis thy betrayal that my heart forsakes!'\n"
            elif voice_format == "sports_announcement":
                base_prompt += "YOU MUST WRITE AS A SPORTS PLAY-BY-PLAY ANNOUNCER:\n"
                base_prompt += "- HIGH ENERGY, EXCITED, ENTHUSIASTIC tone throughout\n"
                base_prompt += "- Use sports commentary phrases: 'And here comes', 'OH MY!', 'UNBELIEVABLE!'\n"
                base_prompt += "- Include sports metaphors and terminology\n"
                base_prompt += "- Build dramatic tension and excitement\n"
                base_prompt += "- Sound like ESPN, NBA commentator, or football announcer\n"
                base_prompt += "- Example: 'AND HERE WE GO, folks! We're witnessing a GAME-CHANGING moment!'\n"
            elif voice_format == "villain_monologue":
                base_prompt += "YOU MUST WRITE AS A THEATRICAL MOVIE VILLAIN MONOLOGUE:\n"
                base_prompt += "- Be DRAMATIC, MENACING, GRANDIOSE, and OVER-THE-TOP\n"
                base_prompt += "- Include villain clichés: evil laughter (Mwahahaha!), grand declarations\n"
                base_prompt += "- Reveal your 'master plan' dramatically\n"
                base_prompt += "- Sound like a Bond villain or comic book supervillain\n"
                base_prompt += "- Use phrases like: 'You fool!', 'At last!', 'Behold!'\n"
                base_prompt += "- Example: 'Mwahaha! You see now, don't you? My plan was PERFECT all along!'\n"
            else:
                # Custom voice format
                base_prompt += f"YOU MUST FULLY EMBODY THIS STYLE: '{voice_format}'\n"
                base_prompt += "- Make it EXTREMELY obvious and pronounced\n"
                base_prompt += "- Go ALL IN on this format - don't hold back\n"
            base_prompt += "=== END FORMAT REQUIREMENTS ===\n\n"

        if voice_personality:
            base_prompt += f"\n=== VOICE PERSONALITY REQUIREMENT ===\n"
            base_prompt += f"PERSONALITY: {voice_personality.upper()}\n"
            base_prompt += f"IMPORTANT: Use this personality/accent WHILE STILL MAINTAINING the context of angry_at ({angry_at}), tone ({tone}), and kindness ({kindness_scale}).\n"
            base_prompt += f"The personality is the VOICE/ACCENT, not the content. The message must still be appropriate for {angry_at}.\n\n"
            if voice_personality == "british":
                base_prompt += "SPEAK AS A PROPER BRITISH PERSON:\n"
                base_prompt += "- Use British slang: bloody, bloke, chap, mate, brilliant, rubbish, bollocks, cheers\n"
                base_prompt += "- British phrases: 'Rather unfortunate', 'Quite frankly', 'I say', 'Terribly sorry'\n"
                base_prompt += "- Sophisticated, refined, proper vocabulary\n"
                base_prompt += "- Sound like a posh Londoner or British aristocrat\n"
            elif voice_personality == "wise_wizard":
                base_prompt += "SPEAK AS A WISE OLD WIZARD:\n"
                base_prompt += "- Use mystical/cryptic language and ancient wisdom\n"
                base_prompt += "- Phrases like: 'In my centuries of existence', 'The spirits tell me', 'Beware, young one'\n"
                base_prompt += "- Sound knowing, mysterious, and magical\n"
                base_prompt += "- Like Gandalf or Dumbledore giving sage advice\n"
            elif voice_personality == "teenage_girl":
                base_prompt += "SPEAK AS A TEENAGE GIRL:\n"
                base_prompt += "- Use Gen Z slang: like, literally, no cap, fr fr, slay, periodt, bestie, vibe\n"
                base_prompt += "- Be VERY expressive and enthusiastic\n"
                base_prompt += "- Modern social media language and emojis vibes\n"
                base_prompt += "- Sound casual, bubbly, dramatic\n"
            elif voice_personality == "corporate_executive":
                base_prompt += "SPEAK AS A CORPORATE EXECUTIVE:\n"
                base_prompt += "- Use business jargon: synergy, leverage, circle back, bandwidth, actionable items\n"
                base_prompt += "- Assertive, commanding, no-nonsense tone\n"
                base_prompt += "- Professional but direct and authoritative\n"
                base_prompt += "- Sound like a CEO in a board meeting\n"
            elif voice_personality == "cocky_villain":
                base_prompt += "SPEAK AS A COCKY, ARROGANT VILLAIN:\n"
                base_prompt += "- Be SMUG, overconfident, condescending\n"
                base_prompt += "- Mock and belittle while being theatrical\n"
                base_prompt += "- Revel in your superiority\n"
                base_prompt += "- Sound like Loki or a smug supervillain\n"
            else:
                # Custom personality
                base_prompt += f"EMBODY THIS PERSONALITY: '{voice_personality}'\n"
                base_prompt += "- Make this personality VERY obvious in your speech\n"
            base_prompt += "=== END PERSONALITY REQUIREMENTS ===\n\n"

        # Only add format constraints if NO voice format is specified
        # Voice formats have their own length/style requirements that override standard format rules
        if not voice_format:
            base_prompt += f"\nFormat: {format}\n"

            if format == "email":
                base_prompt += "Format as a professional email with customized specialized greeting and signature. Use paragraphs.\n"
            elif format == "text":
                base_prompt += "Keep it brief - maximum 2-3 sentences. Casual text message style.\n"
            elif format == "social_media":
                base_prompt += "Make it concise and shareable. Keep it punchy, 1-2 short paragraphs.\n"
            elif format == "review":
                base_prompt += "Structure as an online review with specific feedback. Be clear and factual.\n"
        else:
            # When voice format is specified, allow it to determine the length and structure
            base_prompt += f"\nOUTPUT FORMAT: The voice format ({voice_format}) determines the structure and length. Do not apply standard format constraints.\n"

        base_prompt += "\nImportant Rules:\n"
        base_prompt += "- For each message to be transformed, first assume the base case of transformation to be based on the intended person determined by angry_at."
        base_prompt += "- Following assumption of base case of transformation, modify the transformation by applying tone. Allow intensity of tone if emotion to altered according to kindness_scale. "
        base_prompt += "- Allow analysis of original message's overarching issue to modify the transformation to be applied"
        base_prompt += "- Let kindness_level be the most important factor affecting the transformation. The kindness_scale determines the if the tone and word choice of the initial message is lightened in emotional intensity or made more professional (depending on the angry_at), or if the word choice of the initial message should be intensified to show deeper frustration and anger."

        if profanity_check == "censored":
            base_prompt += "\n- Remove or replace any profanity with contextually appropriate alternatives while maintaining emotional intent\n"

        # Length constraints - calculate target word count based on input
        # Estimate word count: roughly message_length / 5 (average word length + space)
        estimated_input_words = max(1, message_length // 5)
        target_min_words = max(1, estimated_input_words - 20)
        target_max_words = estimated_input_words + 20

        base_prompt += "\nLength:\n"
        if not voice_format:
            # Standard text format length constraints
            base_prompt += f"- The original message is approximately {estimated_input_words} words.\n"
            base_prompt += f"- Keep your transformed message within {target_min_words}-{target_max_words} words (±20 words from original).\n"
            base_prompt += f"- Maintain the essence of the message while staying close to the original length.\n"
        else:
            # Voice format length constraints - allow longer but still reasonable
            base_prompt += f"- The original message is approximately {estimated_input_words} words.\n"
            base_prompt += f"- Target range: {target_min_words}-{target_max_words} words (±20 words from original).\n"
            base_prompt += "- Voice formats need creative space, but keep it reasonable and focused.\n"
            if voice_format == "rap":
                base_prompt += "- For rap: Aim for 8-16 bars (lines) while staying within the word count range.\n"
            elif voice_format == "shakespearean":
                base_prompt += "- For Shakespearean: 1-2 short stanzas or 8-14 lines while staying within the word count range.\n"
            elif voice_format == "cursed_spell":
                base_prompt += "- For cursed spell: 3-6 lines of mystical incantation while staying within the word count range.\n"
            elif voice_format == "sports_announcement":
                base_prompt += "- For sports announcement: 2-4 short paragraphs while staying within the word count range.\n"
            elif voice_format == "villain_monologue":
                base_prompt += "- For villain monologue: 2-3 paragraphs while staying within the word count range.\n"
            else:
                base_prompt += "- Keep it expressive but reasonable in length (within the word count range).\n"

        base_prompt += "\nConstraints:\n"
        if not voice_format:
            # Stricter constraints for normal text transformations
            base_prompt += "- PRESERVE the original message structure and sentence flow\n"
            base_prompt += "- Transform by adjusting specific words/phrases, not completely rewriting\n"
        else:
            # More flexible constraints for voice formats that need creative restructuring
            base_prompt += "- Convey the original message's core meaning and emotion in the required format\n"
            base_prompt += "- You may need to restructure to fit the voice format (rap verses, spells, etc.)\n"
        base_prompt += "- Maintain the core message and concern from the original\n"
        base_prompt += "- Don't add information that wasn't in the original message\n"
        base_prompt += "- Only return the transformed message, nothing else\n"

        base_prompt += f"\n=== FINAL REMINDER ===\n"
        if voice_format:
            base_prompt += f"PRIORITY 1: FULLY COMMIT to the {voice_format.upper()} format. Make it EXTREMELY obvious and pronounced.\n"
            base_prompt += f"PRIORITY 2: This is for a {angry_at.upper()} with {tone.upper()} tone and kindness {kindness_scale}/5.\n"
            base_prompt += f"The voice format is HOW you deliver it. The relationship/tone/kindness is WHAT emotion to convey.\n"
        else:
            base_prompt += f"This message is FOR A {angry_at.upper()}. Make sure the message is appropriate for that relationship.\n"
            base_prompt += f"The tone is {tone.upper()} with kindness level {kindness_scale}/5.\n"

        return base_prompt

    async def transform_message(
      self,
      message: str,
      angry_at: str,
      format: str,
      tone: str,
      kindness_scale: int,
      profanity_check: str = "none",
      voice_format: str = None,
      voice_personality: str = None
     ) -> str:
        """Transform the user's message using OpenAI."""
        try:
            message_length = len(message)
            system_prompt = self._build_system_prompt(angry_at, format, tone, kindness_scale, profanity_check, message_length, voice_format, voice_personality)

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Transform this message: {message}"}
                ],
                temperature=0.7,
                max_tokens=500
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"OpenAI transformation error: {str(e)}")
