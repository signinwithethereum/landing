<template>
  <div class="blank-lines" aria-label="How blank lines change when a SIWE statement is omitted">
    <div class="blank-lines__key">
      <span class="t-label">Message seam</span>
      <span class="blank-lines__key-item"><i /> required empty line</span>
    </div>

    <div class="blank-lines__examples">
      <figure class="blank-lines__example">
        <figcaption>
          <strong>With a statement</strong>
          <span>one empty line on each side</span>
        </figcaption>
        <pre><code><span>0x7291…4d558f</span><span class="blank-lines__empty" aria-label="required empty line"></span><span>Sign in to Example App.</span><span class="blank-lines__empty" aria-label="required empty line"></span><span>URI: https://app.example.com</span></code></pre>
      </figure>

      <figure class="blank-lines__example">
        <figcaption>
          <strong>Without a statement</strong>
          <span>two consecutive empty lines</span>
        </figcaption>
        <pre><code><span>0x7291…4d558f</span><span class="blank-lines__empty" aria-label="first required empty line"></span><span class="blank-lines__empty" aria-label="second required empty line"></span><span>URI: https://app.example.com</span></code></pre>
      </figure>
    </div>

    <p class="blank-lines__note">This is a structural view, not a copy-and-paste message. The empty lines are part of the signed bytes.</p>
  </div>
</template>
