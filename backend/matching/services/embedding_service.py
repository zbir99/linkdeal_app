"""
Embedding service using local SentenceTransformers model.
No external API calls needed - runs entirely locally.
"""
import logging
import numpy as np
from threading import Lock
from typing import List, Optional
from django.conf import settings

logger = logging.getLogger(__name__)

# Global model instance (lazy loaded)
_model = None
_model_lock = Lock()


class EmbeddingService:
    """
    Service for generating text embeddings using local SentenceTransformers.
    """
    
    @staticmethod
    def _get_model():
        """Lazy load the SentenceTransformer model (thread-safe)."""
        global _model
        if _model is None:
            with _model_lock:
                if _model is None:
                    try:
                        from sentence_transformers import SentenceTransformer
                        model_name = getattr(settings, 'SENTENCE_EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
                        logger.info(f"Loading SentenceTransformer model: {model_name}")
                        _model = SentenceTransformer(model_name)
                        logger.info("SentenceTransformer model loaded successfully")
                    except Exception as e:
                        logger.error(f"Failed to load SentenceTransformer: {e}")
                        return None
        return _model

    @classmethod
    def generate_embedding(cls, text: str) -> Optional[List[float]]:
        """
        Generate embedding vector for the given text using local model.
        """
        if settings.USE_MOCK_AI:
            return cls._generate_mock_embedding()
        
        try:
            model = cls._get_model()
            if not model:
                logger.error("SentenceTransformer model not available")
                return cls._generate_mock_embedding()

            # Generate embedding (returns numpy array)
            embedding = model.encode(text, normalize_embeddings=True)
            result = embedding.tolist()
            logger.info(f"Generated embedding with dimension: {len(result)}")
            return result
        
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return cls._generate_mock_embedding()
    
    @classmethod
    def generate_batch_embeddings(cls, texts: List[str]) -> List[Optional[List[float]]]:
        """
        Generate embeddings for multiple texts in batch.
        """
        if settings.USE_MOCK_AI:
            return [cls._generate_mock_embedding() for _ in texts]
        
        try:
            model = cls._get_model()
            if not model:
                return [cls._generate_mock_embedding() for _ in texts]

            # Batch encode
            embeddings = model.encode(texts, normalize_embeddings=True)
            result = [emb.tolist() for emb in embeddings]
            logger.info(f"Generated {len(result)} embeddings in batch")
            return result
        
        except Exception as e:
            logger.error(f"Error generating batch embeddings: {e}")
            return [cls._generate_mock_embedding() for _ in texts]
    
    @staticmethod
    def _generate_mock_embedding() -> List[float]:
        """
        Generate a random mock embedding for fallback.
        Uses dimension 384 (all-MiniLM-L6-v2 output size).
        """
        logger.info("Using MOCK embedding generation")
        dimension = getattr(settings, 'EMBEDDING_DIMENSION', 384)
        random_vector = np.random.randn(dimension).astype(float)
        norm = np.linalg.norm(random_vector)
        if norm > 0:
            random_vector = random_vector / norm
        return random_vector.tolist()
    
    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """
        Calculate cosine similarity between two vectors.
        """
        try:
            a = np.array(vec1)
            b = np.array(vec2)
            
            dot_product = np.dot(a, b)
            norm_a = np.linalg.norm(a)
            norm_b = np.linalg.norm(b)
            
            if norm_a == 0 or norm_b == 0:
                return 0.0
            
            return float(dot_product / (norm_a * norm_b))
        
        except Exception as e:
            logger.error(f"Error calculating cosine similarity: {e}")
            return 0.0
