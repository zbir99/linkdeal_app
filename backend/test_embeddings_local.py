"""
Script de test pour vérifier le bon fonctionnement des embeddings locaux.
Utilise SentenceTransformers sans appel API.

Usage:
    python test_embeddings_local.py
"""
import os
import sys
import django
import time
import numpy as np

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from matching.services.embedding_service import EmbeddingService

def print_header(title):
    """Affiche un en-tête formaté"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_configuration():
    """Teste la configuration"""
    print_header("1. CONFIGURATION")
    
    print(f"✓ Modèle d'embeddings : {settings.SENTENCE_EMBEDDING_MODEL}")
    print(f"✓ Dimension configurée : {settings.EMBEDDING_DIMENSION}")
    print(f"✓ Mode MOCK : {settings.USE_MOCK_AI}")
    
    if settings.USE_MOCK_AI:
        print("\n⚠️  Mode MOCK activé - Les embeddings seront aléatoires")
        print("   Pour tester le vrai modèle, mettez USE_MOCK_AI=False")
    else:
        print("\n✓ Mode PRODUCTION - Utilise SentenceTransformers")

def test_single_embedding():
    """Teste la génération d'un seul embedding"""
    print_header("2. TEST EMBEDDING SIMPLE")
    
    text = "Je suis un développeur Python passionné par Django et React"
    print(f"Texte : {text}\n")
    
    start_time = time.time()
    embedding = EmbeddingService.generate_embedding(text)
    duration = time.time() - start_time
    
    if embedding:
        print(f"✓ Embedding généré avec succès")
        print(f"✓ Dimension : {len(embedding)}")
        print(f"✓ Temps : {duration:.3f}s")
        print(f"✓ Premiers 5 valeurs : {[round(v, 4) for v in embedding[:5]]}")
        
        # Vérifier que le vecteur est normalisé
        norm = np.linalg.norm(embedding)
        print(f"✓ Norme du vecteur : {norm:.6f} (devrait être ~1.0)")
        
        if abs(norm - 1.0) < 0.01:
            print("✓ Vecteur correctement normalisé ✅")
        else:
            print("⚠️  Vecteur pas bien normalisé")
        
        return embedding
    else:
        print("❌ Échec de la génération d'embedding")
        return None

def test_batch_embeddings():
    """Teste la génération batch d'embeddings"""
    print_header("3. TEST EMBEDDING BATCH")
    
    texts = [
        "Python Django développement web backend",
        "React TypeScript frontend interface utilisateur",
        "Machine Learning Intelligence Artificielle Deep Learning",
        "Base de données PostgreSQL SQL optimisation"
    ]
    
    print(f"Nombre de textes : {len(texts)}\n")
    
    start_time = time.time()
    embeddings = EmbeddingService.generate_batch_embeddings(texts)
    duration = time.time() - start_time
    
    print(f"✓ Batch traité en {duration:.3f}s")
    print(f"✓ Temps moyen par texte : {duration/len(texts):.3f}s")
    
    for i, emb in enumerate(embeddings):
        if emb:
            print(f"  [{i+1}] Dimension: {len(emb)}, Norme: {np.linalg.norm(emb):.4f}")
    
    return embeddings

def test_similarity():
    """Teste le calcul de similarité"""
    print_header("4. TEST SIMILARITÉ COSINE")
    
    # Textes similaires
    text1 = "Python Django développement web"
    text2 = "Django Python backend développeur"
    text3 = "React JavaScript frontend interface"
    
    emb1 = EmbeddingService.generate_embedding(text1)
    emb2 = EmbeddingService.generate_embedding(text2)
    emb3 = EmbeddingService.generate_embedding(text3)
    
    if not all([emb1, emb2, emb3]):
        print("❌ Échec de génération des embeddings")
        return
    
    sim_similar = EmbeddingService.cosine_similarity(emb1, emb2)
    sim_different = EmbeddingService.cosine_similarity(emb1, emb3)
    
    print(f"\nTexte 1 : {text1}")
    print(f"Texte 2 : {text2}")
    print(f"Texte 3 : {text3}\n")
    
    print(f"Similarité (1 ↔ 2) : {sim_similar:.4f} (devrait être haute)")
    print(f"Similarité (1 ↔ 3) : {sim_different:.4f} (devrait être plus basse)")
    
    if not settings.USE_MOCK_AI:
        if sim_similar > sim_different:
            print("✓ La similarité fonctionne correctement ✅")
        else:
            print("⚠️  Résultats de similarité inattendus")
    else:
        print("\n⚠️  En mode MOCK, les similarités sont aléatoires")

def test_real_world_scenario():
    """Teste un scénario réel de matching"""
    print_header("5. TEST SCÉNARIO RÉEL")
    
    # Profil d'un mentoré
    mentee_profile = """
    Je suis débutant en programmation et je veux apprendre le développement web.
    Je m'intéresse particulièrement à Python et Django pour le backend.
    Je parle français et un peu anglais.
    """
    
    # Profils de mentors
    mentors = [
        {
            "name": "Alice",
            "profile": "Expert Django avec 5 ans d'expérience, spécialisée en Python et APIs REST"
        },
        {
            "name": "Bob",
            "profile": "Développeur frontend React et TypeScript, expert en UX/UI design"
        },
        {
            "name": "Charlie",
            "profile": "Data scientist spécialisé en Machine Learning et Deep Learning avec Python"
        }
    ]
    
    print(f"Profil Mentoré :\n{mentee_profile}\n")
    
    # Générer embeddings
    mentee_emb = EmbeddingService.generate_embedding(mentee_profile)
    mentor_embs = EmbeddingService.generate_batch_embeddings([m["profile"] for m in mentors])
    
    if not mentee_emb or not all(mentor_embs):
        print("❌ Échec de génération des embeddings")
        return
    
    # Calculer similarités
    print("Scores de matching :\n")
    results = []
    for mentor, emb in zip(mentors, mentor_embs):
        similarity = EmbeddingService.cosine_similarity(mentee_emb, emb)
        results.append((mentor["name"], similarity))
        print(f"  {mentor['name']:10} : {similarity:.4f}")
    
    if not settings.USE_MOCK_AI:
        # Trier par similarité
        results.sort(key=lambda x: x[1], reverse=True)
        print(f"\n✓ Meilleur match : {results[0][0]} (score: {results[0][1]:.4f})")
        
        if results[0][0] == "Alice":
            print("✓ Matching correct ! Alice est bien le meilleur match pour Django/Python ✅")
        else:
            print("⚠️  Résultat de matching inattendu")
    else:
        print("\n⚠️  En mode MOCK, les scores sont aléatoires")

def test_performance():
    """Teste les performances"""
    print_header("6. TEST PERFORMANCE")
    
    # Test avec différentes tailles de texte
    texts = {
        "Court (20 mots)": " ".join(["Python"] * 20),
        "Moyen (100 mots)": " ".join(["développement web backend"] * 33),
        "Long (500 mots)": " ".join(["Django REST API PostgreSQL"] * 125),
    }
    
    for label, text in texts.items():
        start = time.time()
        emb = EmbeddingService.generate_embedding(text)
        duration = time.time() - start
        
        if emb:
            print(f"{label:20} : {duration:.3f}s")
    
    # Test batch performance
    print("\nPerformance Batch :")
    batch_sizes = [10, 50, 100]
    
    for size in batch_sizes:
        texts_batch = ["Test de performance batch"] * size
        start = time.time()
        embs = EmbeddingService.generate_batch_embeddings(texts_batch)
        duration = time.time() - start
        
        print(f"  {size:3} textes : {duration:.3f}s ({duration/size*1000:.1f}ms/texte)")

def main():
    """Fonction principale"""
    print("\n" + "🚀"*30)
    print("  TEST DES EMBEDDINGS LOCAUX - LINKDEAL")
    print("🚀"*30)
    
    try:
        test_configuration()
        
        # Test de base
        embedding = test_single_embedding()
        
        if not embedding:
            print("\n❌ ÉCHEC : Impossible de générer des embeddings")
            print("Vérifiez que sentence-transformers est installé :")
            print("  pip install sentence-transformers torch")
            return
        
        # Tests avancés
        test_batch_embeddings()
        test_similarity()
        test_real_world_scenario()
        test_performance()
        
        # Résumé
        print_header("RÉSUMÉ")
        print("✅ Tous les tests ont été exécutés")
        
        if settings.USE_MOCK_AI:
            print("\n⚠️  Mode MOCK activé")
            print("   Pour tester le vrai modèle SentenceTransformers :")
            print("   1. Créez backend/.env avec : USE_MOCK_AI=False")
            print("   2. Relancez ce script")
        else:
            print("\n✅ Mode PRODUCTION - SentenceTransformers")
            print("✅ Embeddings 100% locaux et gratuits")
            print("✅ Prêt pour la production !")
        
        print("\n📖 Documentation complète : ARCHITECTURE_EMBEDDINGS.md")
        
    except Exception as e:
        print(f"\n❌ ERREUR : {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

