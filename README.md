# LoanShield

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-7ngtl7nq)

LoanShield is a web-based platform that helps users verify digital lending apps and lenders before sharing money or personal information.

## Problem

Fake loan apps can imitate legitimate lenders and use tactics such as upfront fees, misleading information and excessive permissions.

## Solution

LoanShield combines multiple checks into a single verification process and provides a clear risk verdict.

The prototype currently supports:

- Lender and app verification
- Risk scoring
- Entity relationship verification
- KFS analysis
- Permission risk analysis
- Loan lifecycle tracking
- Fraud reporting and support

## Verification

- **Verified** — sufficient positive evidence was found
- **High Risk** — multiple warning signals were detected
- **Unable to Verify** — there is not enough information to reliably classify the lender

An unknown lender is not automatically classified as fraudulent.

## Technology

React, TypeScript, Tailwind CSS, and rule-based verification logic.

## Prototype

https://loanshield-fintech-a-fql1.bolt.host/

## Hackathon Track

Fraud Detection & Financial Crime Prevention

## Status

This is a hackathon prototype using structured demonstration data. Future improvements include live regulatory data integration and app authenticity checks.
