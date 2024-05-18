---
author: rlc
categories:
- Information Technology
- Data Management
- Interoperability
- Micro-services
- Message Processing
- System Architecture
date: 2024-04-03
layout: post
permalink: https://vlindersoftware.github.io/python-event-superschema/
tags:
- Interoperability (0.9)
- Information systems (0.8)
- Data meaning (0.7)
- Data formatting (0.6)
- Semantics (0.5)
- Micro-services (0.9)
- Message processing (0.8)
- De-coupling (0.7)
- System architecture (0.6)
- Communication (0.8)
- Message definition (0.7)
- Ground rules (0.6)
title: Python super-schema
---

Interoperability is the scourge of all information systems: knowing what data means, how it is formatted, and what the semantics of the various fields are can be a daunting task. Micro-services are generally designed to process messages in potentially large quantities and, in order to do that, need to know what the messages mean. They are also generally designed to be de-coupled from each other so they can easily be replaced or updated. That means that to construct a system with a micro-service-oriented architecture, you need to have them communicate with each other and you need messages to do that. Those messages have to be well-defined and follow some ground rules.