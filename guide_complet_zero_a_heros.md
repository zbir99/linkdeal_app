# 📘 Guide Complet : De Zéro à Héros (Configuration + Workflow)

Ce guide contient **TOUT**. La première partie est à faire **UNE SEULE FOIS** (Configuration). La deuxième partie est ce que vous ferez **TOUS LES JOURS**.

---

# 🛠️ PARTIE 1 : CONFIGURATION UNIQUE (À faire maintenant)

C'est la partie "chiante" mais nécessaire. Une fois faite, vous n'y toucherez plus !

## Étape 1 : Préparer le Serveur (SSH)
1.  **Ouvrez PowerShell** sur votre PC.
2.  **Connectez-vous** : `ssh adminlynvia@109.123.248.72`
3.  **Générez une clé SSH** (pour que le serveur parle à GitHub) :
    ```bash
    ssh-keygen -t ed25519 -C "votre-email@gmail.com"
    ```
    *(Appuyez sur Entrée 3 fois)*
4.  **Affichez la clé** :
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```
5.  **Copiez** tout le texte qui s'affiche (commence par `ssh-ed25519...`).
6.  **Allez sur GitHub** > Settings > SSH and GPG keys > New SSH key.
7.  Collez la clé et validez.

## Étape 2 : Configurer le "Robot" CI/CD (GitHub Actions)
Pour que le déploiement soit automatique.

1.  **Sur le serveur** (toujours connecté), affichez votre clé **PRIVÉE** :
    ```bash
    cat ~/.ssh/id_ed25519
    ```
    *(Copiez tout le bloc, de `-----BEGIN` à `-----END`)*.
2.  **Allez sur GitHub** > Votre dépôt > Settings > Secrets and variables > Actions.
3.  Cliquez sur **New repository secret**.
    *   Name : `SSH_PRIVATE_KEY`
    *   Secret : Collez la clé privée.
4.  Cliquez sur **Add secret**.

## Étape 3 : Créer le fichier de "Recette" pour le Robot
Sur votre PC (dans VS Code) :

1.  Créez un dossier `.github` à la racine du projet.
2.  Dans `.github`, créez un dossier `workflows`.
3.  Dans `workflows`, créez un fichier `deploy.yml`.
4.  Collez ce code dedans :

```yaml
name: Déploiement Automatique
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 🚀 Connexion et Mise à jour
        uses: appleboy/ssh-action@master
        with:
          host: 109.123.248.72
          username: adminlynvia
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /srv/teams/Lynvia/linkdeal_app
            git pull origin main
            docker compose up -d --build
            docker image prune -f
```
5.  Sauvegardez, commitez et pushez (`git add .`, `git commit`, `git push`).

✅ **FIN DE LA CONFIGURATION !** Vous ne ferez plus jamais ça.

---

# 🔄 PARTIE 2 : WORKFLOW QUOTIDIEN (Votre routine)

C'est ce que vous ferez chaque jour pour travailler.

## 1. Coder 💻
*   Ouvrez VS Code.
*   Modifiez vos fichiers (HTML, CSS, JS...).
*   Sauvegardez (`Ctrl+S`).

## 2. Tester Localement 🧪
*   Ouvrez le terminal dans VS Code.
*   Allez dans le dossier : `cd linkdeal_app`
*   Lancez : `docker compose up -d --build`
*   Vérifiez sur : [http://localhost:3102](http://localhost:3102)

## 3. Envoyer et Déployer 🚀
Si le test local est bon :

```powershell
# 1. Ajouter les modifs
git add .

# 2. Enregistrer (avec un message clair)
git commit -m "Ajout de la page contact"

# 3. Envoyer (Le robot va déployer tout seul !)
git push origin main
```

## 4. Vérifier en Ligne 🌍
Attendez 2 minutes, puis allez sur : **https://lynvia.fojas.ai**

---

# 🆘 EN CAS DE PROBLÈME

*   **Le site ne change pas ?** Attendez un peu et videz le cache (`Ctrl+F5`).
*   **Erreur GitHub Actions ?** Vérifiez l'onglet "Actions" sur GitHub.
*   **Problème Nginx ?** (Page blanche ou erreur 502) -> Contactez le prof, c'est souvent sa partie.
