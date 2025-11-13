// 欧迪精英房间自动加入脚本
(function() {
  'use strict';

  const ROOM_NAME = '欧迪精英';
  const ROOM_PASSWORD = '114514';
  
  // 使用搜索框搜索房间
  async function useSearchBox() {
    console.log(`[欧迪精英插件] 尝试使用搜索框搜索房间`);
    
    // 查找搜索框
    const searchInput = document.querySelector('.mu-text-field-input');
    
    if (searchInput) {
      console.log(`[欧迪精英插件] 找到搜索框，输入房间名称`);
      
      // 清空搜索框
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // 输入房间名称
      searchInput.value = ROOM_NAME;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // 触发回车键搜索
      searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      searchInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }));
      searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
      
      console.log(`[欧迪精英插件] 已在搜索框中输入: ${ROOM_NAME}`);
      
      // 等待搜索结果加载
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } else {
      console.log(`[欧迪精英插件] 未找到搜索框`);
      return false;
    }
  }

  // 搜索房间
  function searchRoom() {
    console.log(`[欧迪精英插件] 在页面中查找房间: ${ROOM_NAME}`);
    
    // 优先查找 mu-chip 类的元素（根据实际DOM结构）
    const chips = document.querySelectorAll('.mu-chip, span.mu-chip');
    console.log(`[欧迪精英插件] 找到 ${chips.length} 个 mu-chip 元素`);
    
    for (let chip of chips) {
      const chipText = chip.textContent || chip.innerText;
      if (chipText.includes(ROOM_NAME)) {
        console.log(`[欧迪精英插件] 在 mu-chip 中找到房间: ${ROOM_NAME}`);
        return chip;
      }
    }
    
    // 尝试查找房间列表
    const roomList = document.querySelectorAll('.room-item, .room, [class*="room"]');
    
    for (let room of roomList) {
      const roomText = room.textContent || room.innerText;
      if (roomText.includes(ROOM_NAME)) {
        console.log(`[欧迪精英插件] 找到房间: ${ROOM_NAME}`);
        return room;
      }
    }
    
    // 尝试更广泛的搜索
    const allElements = document.querySelectorAll('span, div, a, button');
    for (let element of allElements) {
      const text = (element.textContent || element.innerText || '').trim();
      if (text === ROOM_NAME || text.includes(ROOM_NAME)) {
        console.log(`[欧迪精英插件] 找到房间元素: ${ROOM_NAME}, 标签: ${element.tagName}`);
        return element;
      }
    }
    
    console.log(`[欧迪精英插件] 未找到房间: ${ROOM_NAME}`);
    return null;
  }

  // 加入房间
  function joinRoom(roomElement) {
    console.log(`[欧迪精英插件] 尝试加入房间，点击元素: ${roomElement.tagName}.${roomElement.className}`);
    
    // 点击房间
    roomElement.click();
    
    // 等待密码对话框出现
    setTimeout(() => {
      // 先查找密码对话框
      const dialog = document.querySelector('.mu-dialog');
      
      if (!dialog) {
        console.log(`[欧迪精英插件] 未找到密码对话框，可能房间无密码或已自动进入`);
        return;
      }
      
      // 检查对话框标题是否包含"密码"
      const dialogTitle = dialog.querySelector('.mu-dialog-title');
      if (dialogTitle) {
        const titleText = dialogTitle.textContent || '';
        console.log(`[欧迪精英插件] 找到对话框，标题: "${titleText}"`);
        
        if (!titleText.includes('密码')) {
          console.log(`[欧迪精英插件] 对话框标题不包含"密码"，跳过`);
          return;
        }
      }
      
      // 在对话框内查找输入框
      const passwordInput = dialog.querySelector('.mu-dialog-body input.mu-text-field-input');
      
      if (passwordInput) {
        console.log(`[欧迪精英插件] ✓ 在对话框中找到密码输入框`);
        
        // 聚焦输入框
        passwordInput.focus();
        
        // 清空输入框
        passwordInput.value = '';
        
        // 输入密码
        passwordInput.value = ROOM_PASSWORD;
        
        // 触发各种事件以确保框架捕获输入
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log(`[欧迪精英插件] 已输入密码: ${ROOM_PASSWORD}`);
        
        // 查找对话框中的确认按钮
        setTimeout(() => {
          // 在对话框的 actions 区域查找确定按钮
          const dialogActions = dialog.querySelector('.mu-dialog-actions');
          
          if (dialogActions) {
            const buttons = dialogActions.querySelectorAll('button.mu-button');
            console.log(`[欧迪精英插件] 在对话框中找到 ${buttons.length} 个按钮`);
            
            let confirmButton = null;
            
            for (let button of buttons) {
              const buttonText = (button.textContent || button.innerText || '').trim();
              console.log(`[欧迪精英插件] 检查按钮: "${buttonText}"`);
              
              if (buttonText === '确定' || buttonText === '确认' || buttonText === 'OK') {
                confirmButton = button;
                console.log(`[欧迪精英插件] ✓ 找到确认按钮`);
                break;
              }
            }
            
            if (confirmButton) {
              console.log(`[欧迪精英插件] 点击确认按钮`);
              confirmButton.click();
            } else {
              console.log(`[欧迪精英插件] 未找到确认按钮，尝试按回车键`);
              // 尝试按回车键
              passwordInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
              passwordInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }));
              passwordInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
            }
          }
        }, 500);
      } else {
        console.log(`[欧迪精英插件] 在对话框中未找到输入框`);
      }
    }, 1000);
  }

  // 创建房间
  async function createRoom() {
    console.log(`[欧迪精英插件] 尝试创建房间: ${ROOM_NAME}`);
    
    // 查找创建房间的表单（应该已经在页面上）
    const form = document.querySelector('form.mu-form, form.mu-demo-form');
    
    if (!form) {
      console.log(`[欧迪精英插件] 未找到创建房间表单`);
      return;
    }
    
    console.log(`[欧迪精英插件] 找到创建房间表单`);
    
    // 查找房间名称输入框（placeholder="房间名称"）
    const nameInput = form.querySelector('input[placeholder="房间名称"]');
    if (nameInput) {
      console.log(`[欧迪精英插件] 填写房间名称: ${ROOM_NAME}`);
      nameInput.focus();
      nameInput.value = ROOM_NAME;
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      console.log(`[欧迪精英插件] 未找到房间名称输入框`);
    }
    
    // 等待一下，然后查找"房间密码"开关
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 查找"房间密码"开关
    const switches = form.querySelectorAll('.mu-switch');
    let passwordSwitch = null;
    
    for (let switchElem of switches) {
      const label = switchElem.querySelector('.mu-switch-label');
      if (label && label.textContent.includes('房间密码')) {
        passwordSwitch = switchElem;
        console.log(`[欧迪精英插件] 找到"房间密码"开关`);
        break;
      }
    }
    
    if (passwordSwitch) {
      // 检查开关是否已经打开
      const checkbox = passwordSwitch.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.checked) {
        console.log(`[欧迪精英插件] 点击"房间密码"开关`);
        passwordSwitch.click();
        
        // 等待密码输入框出现
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 查找密码输入框（在开关点击后出现）
        const passwordInput = form.querySelector('input[placeholder*="密码"], input.mu-text-field-input[type="password"]');
        if (passwordInput) {
          console.log(`[欧迪精英插件] 填写房间密码: ${ROOM_PASSWORD}`);
          passwordInput.focus();
          passwordInput.value = ROOM_PASSWORD;
          passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
          passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          console.log(`[欧迪精英插件] 未找到密码输入框，尝试查找所有新出现的输入框`);
          // 尝试查找表单中第三个输入框（房间名称、房间描述之后的）
          const allInputs = form.querySelectorAll('input.mu-text-field-input');
          if (allInputs.length >= 3) {
            const thirdInput = allInputs[2];
            console.log(`[欧迪精英插件] 在第三个输入框填写密码`);
            thirdInput.focus();
            thirdInput.value = ROOM_PASSWORD;
            thirdInput.dispatchEvent(new Event('input', { bubbles: true }));
            thirdInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    } else {
      console.log(`[欧迪精英插件] 未找到"房间密码"开关`);
    }
    
    // 等待一下，然后点击"创建房间"按钮
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 查找"创建房间"按钮
    const buttons = form.querySelectorAll('button.mu-button');
    let createButton = null;
    
    for (let button of buttons) {
      const buttonText = (button.textContent || button.innerText || '').trim();
      if (buttonText.includes('创建房间')) {
        createButton = button;
        console.log(`[欧迪精英插件] 找到"创建房间"按钮`);
        break;
      }
    }
    
    if (createButton) {
      console.log(`[欧迪精英插件] 点击"创建房间"按钮`);
      createButton.click();
      console.log(`[欧迪精英插件] ✓ 房间创建请求已发送`);
    } else {
      console.log(`[欧迪精英插件] 未找到"创建房间"按钮`);
    }
  }

  // 主函数
  async function main() {
    console.log(`[欧迪精英插件] 插件已加载`);
    
    // 等待页面完全加载
    if (document.readyState !== 'complete') {
      await new Promise(resolve => {
        window.addEventListener('load', resolve);
      });
    }
    
    // 额外等待一段时间,确保动态内容加载完成
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 先使用搜索框搜索
    await useSearchBox();
    
    // 在搜索结果中查找房间
    const roomElement = searchRoom();
    
    if (roomElement) {
      // 找到房间,加入
      joinRoom(roomElement);
    } else {
      // 未找到房间,创建
      await createRoom();
    }
  }

  // 启动脚本
  main().catch(error => {
    console.error(`[欧迪精英插件] 错误:`, error);
  });

})();

