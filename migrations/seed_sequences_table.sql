-- Insert sample sequences
INSERT INTO sequences
    (id, user_id, org_id, name, content, messages)
VALUES
    (
        'seq_001',
        'user_001',
        'org_001',
        'Software Engineer Outreach',
        'Subject: Exciting Software Engineering Opportunity at Our Company

I noticed your impressive experience in full-stack development and wanted to connect regarding an exciting opportunity at our company.

We''re building innovative solutions using React, Node.js, and PostgreSQL - technologies I see you''ve worked with extensively. Your contributions to open-source projects and your experience at [Previous Company] caught my attention.

Would you be open to a brief conversation about how your expertise could help shape our engineering team? I''d love to share more details about our projects and culture.',
        '[
        {"sender": "user", "text": "Help me write an outreach email for a software engineer"},
        {"sender": "assistant", "text": "I''ve created a personalized outreach template focusing on technical expertise"}
    ]'
::jsonb
),
(
    'seq_002',
    'user_001',
    'org_001',
    'Data Scientist Welcome',
    'Subject: Join Our Data Science Team

I''m reaching out because your background in machine learning and data analytics aligns perfectly with what we''re building.

Our team is tackling complex challenges in AI and ML, and your research in [specific area] particularly caught my attention. We''re using cutting-edge technologies like TensorFlow and PyTorch in production.

I''d love to schedule a call to discuss how your expertise could contribute to our growing data science initiatives. Are you available for a brief chat this week?',
    '[
        {"sender": "user", "text": "Create an outreach sequence for data scientists"},
        {"sender": "assistant", "text": "Here''s a data science focused outreach email emphasizing ML/AI work"}
    ]'::jsonb
),
(
    'seq_003',
    'user_001',
    'org_001',
    'Product Manager Introduction',
    'Subject: Product Leadership Opportunity

I came across your profile and was impressed by your track record of launching successful products in the [specific] industry.

We''re looking for a product leader to drive our next generation of features. Your experience with agile methodologies and your success in launching [specific product] at [Previous Company] suggests you''d be a great fit for what we''re building.

Would you be interested in learning more about our product vision and how you could help shape its direction? I''d appreciate the chance to connect for a brief discussion.',
    '[
        {"sender": "user", "text": "Draft an outreach email for experienced product managers"},
        {"sender": "assistant", "text": "I''ve created a template focusing on product leadership and innovation"}
    ]'::jsonb
);

-- Insert a sequence with multiple message exchanges
INSERT INTO sequences
    (id, user_id, org_id, name, content, messages)
VALUES
    (
        'seq_004',
        'user_001',
        'org_001',
        'Tech Lead Conversation',
        'Subject: Senior Tech Leadership Role - Perfect Match for Your Expertise

I was impressed by your technical leadership experience and the scale of systems you''ve architected.

Your background in scaling microservices architecture and leading distributed teams is exactly what we''re looking for. We''re building something exciting, and your experience with cloud infrastructure and team mentorship would be invaluable.

Would you be open to a conversation about joining our team as a Tech Lead? I''d love to share our technical roadmap and discuss how your expertise could help shape our engineering future.',
        '[
        {"sender": "user", "text": "I need help writing to a potential tech lead candidate"},
        {"sender": "assistant", "text": "I''ll help craft a message that emphasizes technical leadership"},
        {"sender": "user", "text": "Can you make it more focused on architecture experience?"},
        {"sender": "assistant", "text": "I''ve updated the message to highlight architectural expertise"},
        {"sender": "user", "text": "Perfect, this looks good!"}
    ]'
::jsonb
);

-- Update some timestamps to simulate activity
UPDATE sequences 
SET updated_at = CURRENT_TIMESTAMP - INTERVAL
'2 days'
WHERE id = 'seq_001';

UPDATE sequences 
SET updated_at = CURRENT_TIMESTAMP - INTERVAL
'1 day'
WHERE id = 'seq_002'; 