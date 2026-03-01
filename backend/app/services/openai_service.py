# TEXT - OpenAI service for message transformation

from openai import AsyncOpenAI
from app.config import settings

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model

    def _build_system_prompt(self, angry_at: str, format: str, tone: str, kindness_scale: int, profanity_check: str = "none", message_length: int = 0) -> str:
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

        base_prompt += f"\nFormat: {format}\n"

        if format == "email":
            base_prompt += "Format as a professional email with customized specialized greeting and signature. Use paragraphs.\n"
        elif format == "text":
            base_prompt += "Keep it brief - maximum 2-3 sentences. Casual text message style.\n"
        elif format == "social_media":
            base_prompt += "Make it concise and shareable. Keep it punchy, 1-2 short paragraphs.\n"
        elif format == "review":
            base_prompt += "Structure as an online review with specific feedback. Be clear and factual.\n"

        base_prompt += "\nImportant Rules:\n"
        base_prompt += "- For each message to be transformed, first assume the base case of transformation to be based on the intended person determined by angry_at."
        base_prompt += "- Following assumption of base case of transformation, modify the transformation by applying tone. Allow intensity of tone if emotion to altered according to kindness_scale. "
        base_prompt += "- Allow analysis of original message's overarching issue to modify the transformation to be applied"
        base_prompt += "- Let kindness_level be the most important factor affecting the transformation. The kindness_scale determines the if the tone and word choice of the initial message is lightened in emotional intensity or made more professional (depending on the angry_at), or if the word choice of the initial message should be intensified to show deeper frustration and anger."

        if profanity_check == "censored":
            base_prompt += "\n- Remove or replace any profanity with contextually appropriate alternatives while maintaining emotional intent\n"

        base_prompt += "\nLength:\n"
        if message_length < 50:
            base_prompt += "- Original message is very short. Expand slightly to be more complete and clear (aim for 2-3 sentences).\n"
        elif message_length < 150:
            base_prompt += "- Keep the transformed message similar in length to the original.\n"
        elif message_length < 300:
            base_prompt += "- Original message is moderate length. Keep transformation concise and similar in length.\n"
        else:
            base_prompt += "- Original message is long. Condense the transformation while preserving all key points.\n"

        base_prompt += "\nConstraints:\n"
        base_prompt += "- PRESERVE the original message structure and sentence flow\n"
        base_prompt += "- Transform by adjusting specific words/phrases, not completely rewriting\n"
        base_prompt += "- Maintain the core message and concern from the original\n"
        base_prompt += "- Don't add information that wasn't in the original message\n"
        base_prompt += "- Only return the transformed message, nothing else\n"

        return base_prompt

    async def transform_message(
        self,
        message: str,
        angry_at: str,
        format: str,
        tone: str,
        kindness_scale: int,
        profanity_check: str = "none"
    ) -> str:
        """Transform the user's message using OpenAI."""
        try:
            message_length = len(message)
            system_prompt = self._build_system_prompt(angry_at, format, tone, kindness_scale, profanity_check, message_length)

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
