#!/bin/bash
#
# 博客恢复项目推送脚本
# 将 Hexo 源码推送到 GitHub source 分支
#

set -e

PROJECT_DIR="/home/yuchen/Works/blog-recovery"
REMOTE_URL="https://github.com/Orion-wyc/orion-wyc.github.io.git"

echo "========================================"
echo "  Hexo 博客恢复项目 - 推送脚本"
echo "========================================"

cd "$PROJECT_DIR"

# 1. 检查当前分支
echo ""
echo "[1] 检查 Git 状态..."
CURRENT_BRANCH=$(git branch --show-current)
echo "当前分支: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "source" ]; then
    echo "错误: 请确保在 source 分支上运行此脚本"
    exit 1
fi

# 2. 检查远程仓库配置
echo ""
echo "[2] 检查远程仓库配置..."
if ! git remote | grep -q "origin"; then
    echo "添加远程仓库..."
    git remote add origin "$REMOTE_URL"
fi
echo "远程仓库: $(git remote get-url origin)"

# 3. 确保 Markdown 文件不会被忽略
echo ""
echo "[3] 确保 Markdown 源文件会被追踪..."
if [ -f ".gitignore" ]; then
    # 检查 .gitignore 中是否错误地忽略了 .md 文件
    if grep -q "^\*\.md$" .gitignore || grep -q "^\.md$" .gitignore; then
        echo "警告: .gitignore 中可能包含了对 .md 文件的忽略，正在修复..."
        sed -i '/^\*\.md$/d' .gitignore
        sed -i '/^\.md$/d' .gitignore
    fi
fi

# 确保 source/_posts 目录中的 .md 文件被追踪
echo "检查 Markdown 文件..."
MD_COUNT=$(find source/_posts -name "*.md" -type f | wc -l)
echo "找到 $MD_COUNT 个 Markdown 文件"

# 4. 添加所有文件到 Git
echo ""
echo "[4] 添加文件到 Git..."
git add -A

# 显示将要提交的文件
echo ""
echo "将要提交的文件列表:"
echo "----------------------------------------"
git status --short
echo "----------------------------------------"

# 5. 创建提交
echo ""
echo "[5] 创建提交..."
COMMIT_MSG="恢复 Hexo 博客源码 - 包含 20 篇文章

- 从静态 HTML 恢复博客结构
- 提取所有 20 篇文章为 Markdown 格式
- 配置 Fluid 主题
- 设置 GitHub Actions 自动部署到 master 分支
- 恢复图片资源

日期: $(date '+%Y-%m-%d %H:%M:%S')"

git commit -m "$COMMIT_MSG" || {
    echo "没有新的更改需要提交"
}

# 6. 推送到远程仓库
echo ""
echo "[6] 推送到远程仓库 source 分支..."
echo "注意: 这将强制推送 source 分支"

# 检查是否需要强制推送
if git ls-remote --heads origin source 2>/dev/null | grep -q "source"; then
    echo "远程 source 分支已存在，将进行强制推送..."
    git push -f origin source
else
    echo "远程 source 分支不存在，创建新分支..."
    git push -u origin source
fi

# 7. 显示最终状态
echo ""
echo "[7] 推送完成，显示最终状态..."
echo "----------------------------------------"
git log --oneline -3
echo "----------------------------------------"
echo ""
echo "Markdown 文件统计:"
find source/_posts -name "*.md" -type f -exec ls -lh {} \; | awk '{print $NF, $5}'

echo ""
echo "========================================"
echo "  推送成功完成!"
echo "========================================"
echo ""
echo "下一步:"
echo "  1. GitHub Actions 将自动构建并部署到 master 分支"
echo "  2. 几分钟后访问 https://orion-wyc.github.io 查看效果"
echo "  3. 若构建失败，检查 GitHub Actions 日志"
echo ""
echo "手动触发构建（如果需要）:"
echo "  hexo clean && hexo generate"
echo ""