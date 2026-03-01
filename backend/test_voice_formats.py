#!/usr/bin/env python3
"""
Test script to demonstrate voice format and personality variations.
Shows how the same message transforms differently with different settings.
"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.services.openai_service import OpenAIService

async def test_voice_formats():
    """Test different voice formats with the same message."""

    service = OpenAIService()

    # Test message
    message = "I can't believe you forgot our meeting again. This is the third time this month."
    angry_at = "coworker"
    kindness = 2  # Harsh

    print("=" * 80)
    print("TESTING VOICE FORMATS")
    print("=" * 80)
    print(f"\nOriginal Message: {message}")
    print(f"Angry At: {angry_at}")
    print(f"Kindness Level: {kindness}/5 (harsh)")
    print("\n" + "=" * 80)

    # Test different voice formats
    formats = [
        ("rap", "british", "Rap with British Accent"),
        ("shakespearean", "wise_wizard", "Shakespearean with Wise Wizard"),
        ("sports_announcement", "teenage_girl", "Sports Announcement with Teenage Girl"),
        ("villain_monologue", "corporate_executive", "Villain Monologue with Corporate Executive"),
        ("cursed_spell", "cocky_villain", "Cursed Spell with Cocky Villain"),
    ]

    for voice_format, voice_personality, description in formats:
        print(f"\n{'='*80}")
        print(f"FORMAT: {description}")
        print(f"Voice Format: {voice_format}")
        print(f"Voice Personality: {voice_personality}")
        print(f"{'='*80}")

        try:
            result = await service.transform_message(
                message=message,
                angry_at=angry_at,
                format="text",
                tone="intimidating",
                kindness_scale=kindness,
                profanity_check="censored",
                voice_format=voice_format,
                voice_personality=voice_personality
            )

            print(f"\nTRANSFORMED MESSAGE:")
            print(f"{result}")

        except Exception as e:
            print(f"\nERROR: {str(e)}")

    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)

async def test_kindness_levels():
    """Test how kindness level affects the same voice format."""

    service = OpenAIService()

    message = "You really messed this up."
    angry_at = "friend"
    voice_format = "rap"
    voice_personality = "british"

    print("\n" + "=" * 80)
    print("TESTING KINDNESS LEVELS")
    print("=" * 80)
    print(f"\nOriginal Message: {message}")
    print(f"Angry At: {angry_at}")
    print(f"Voice Format: Rap")
    print(f"Voice Personality: British")
    print("\n" + "=" * 80)

    kindness_levels = [
        (1, "intimidating", "VERY HARSH"),
        (3, "disappointed", "BALANCED"),
        (5, "professional", "VERY KIND"),
    ]

    for kindness, tone, label in kindness_levels:
        print(f"\n{'='*80}")
        print(f"KINDNESS LEVEL: {kindness}/5 - {label}")
        print(f"Tone: {tone}")
        print(f"{'='*80}")

        try:
            result = await service.transform_message(
                message=message,
                angry_at=angry_at,
                format="text",
                tone=tone,
                kindness_scale=kindness,
                profanity_check="censored",
                voice_format=voice_format,
                voice_personality=voice_personality
            )

            print(f"\nTRANSFORMED MESSAGE:")
            print(f"{result}")

        except Exception as e:
            print(f"\nERROR: {str(e)}")

    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)

async def main():
    """Run all tests."""
    print("\n" + "🎤" * 40)
    print("VOICE FORMAT & PERSONALITY TEST SUITE")
    print("🎤" * 40)

    # Test 1: Different formats and personalities
    await test_voice_formats()

    # Small pause
    print("\n\n")
    await asyncio.sleep(1)

    # Test 2: Same format/personality with different kindness
    await test_kindness_levels()

    print("\n" + "🎤" * 40)
    print("ALL TESTS COMPLETE")
    print("🎤" * 40 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
