from matching.models import MenteeConversation

# Test creating a conversation
try:
    m = MenteeConversation.objects.create(
        conversation="test",
        session_id="test-debug",
        messages=[],
        message_count=0
    )
    print(f"✅ Created conversation: {m.id}")
    print(f"Fields: conversation={m.conversation}, messages={m.messages}, message_count={m.message_count}")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
