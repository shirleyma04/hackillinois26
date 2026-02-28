#!/usr/bin/env python3
"""
Test script for Crash Out API
Runs multiple test cases and displays results
"""

import requests
import json

API_URL = "http://localhost:8000/api/transform/"

# Test cases
tests = [
    {
        "name": "Friend - Acquaintance (K1)",
        "data": {
            "message": "You keep canceling our plans at the last minute. It's really frustrating.",
            "angry_at": "friend",
            "tone": "professional",
            "kindness_scale": 1,
            "format": "text",
            "profanity_check": "none"
        }
    },
    {
        "name": "Friend - Close (K5, CAPS)",
        "data": {
            "message": "Dude you KEEP canceling on me! This is the THIRD TIME!",
            "angry_at": "friend",
            "tone": "disappointed",
            "kindness_scale": 5,
            "format": "text",
            "profanity_check": "none"
        }
    },
    {
        "name": "Coworker - Boss Level (K1)",
        "data": {
            "message": "The deadline was yesterday and you STILL haven't submitted your report!",
            "angry_at": "coworker",
            "tone": "professional",
            "kindness_scale": 1,
            "format": "email",
            "profanity_check": "none"
        }
    },
    {
        "name": "Sarcastic",
        "data": {
            "message": "You borrowed my car and returned it empty!",
            "angry_at": "friend",
            "tone": "sarcastic",
            "kindness_scale": 4,
            "format": "text",
            "profanity_check": "none"
        }
    },
    {
        "name": "Profanity - None Mode (K5 allows profanity)",
        "data": {
            "message": "You're being a complete asshole!",
            "angry_at": "friend",
            "tone": "disappointed",
            "kindness_scale": 5,
            "format": "text",
            "profanity_check": "none"
        }
    },
    {
        "name": "Profanity - Censored Mode",
        "data": {
            "message": "You're being a complete asshole about this shit!",
            "angry_at": "friend",
            "tone": "disappointed",
            "kindness_scale": 4,
            "format": "text",
            "profanity_check": "censored"
        }
    },
    {
        "name": "Very Short Message",
        "data": {
            "message": "I hate this!",
            "angry_at": "friend",
            "tone": "professional",
            "kindness_scale": 2,
            "format": "text",
            "profanity_check": "none"
        }
    },
    {
        "name": "Intimidating + K5",
        "data": {
            "message": "You need to stop ignoring my messages NOW!",
            "angry_at": "friend",
            "tone": "intimidating",
            "kindness_scale": 5,
            "format": "text",
            "profanity_check": "none"
        }
    }
]

def run_tests():
    print("=" * 80)
    print("CRASH OUT API TEST SUITE")
    print("=" * 80)
    print()

    passed = 0
    failed = 0

    for i, test in enumerate(tests, 1):
        print(f"Test {i}/{len(tests)}: {test['name']}")
        print("-" * 80)

        try:
            response = requests.post(API_URL, json=test['data'], timeout=30)

            if response.status_code == 200:
                result = response.json()
                print(f"✅ SUCCESS (200)")
                print(f"\nOriginal:\n{result['original_message']}\n")
                print(f"Transformed:\n{result['transformed_message']}\n")
                print(f"Profanity Detected: {result['profanity_detected']}")
                passed += 1
            elif response.status_code == 400:
                result = response.json()
                print(f"❌ REJECTED (400): {result.get('detail', 'Unknown error')}")
                failed += 1
            else:
                print(f"❌ FAILED ({response.status_code}): {response.text[:200]}")
                failed += 1

        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            failed += 1

        print()

    print("=" * 80)
    print(f"RESULTS: {passed} passed, {failed} failed out of {len(tests)} tests")
    print("=" * 80)

if __name__ == "__main__":
    print("Make sure your server is running: uvicorn app.main:app --reload")
    print()
    run_tests()
